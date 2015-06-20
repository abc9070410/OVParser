"use strict";

/*
var gasTitle = [];
var gasPicUrl = [];
var gasFileName = [];
var giVideoIndex = -1;
var giSite = -1;
*/
var gasData = [];

function copyTextToClipboard(text) {
    var eBody = document.getElementsByTagName("body")[0];
    var eDiv = document.createElement("textarea");
    eDiv.id = "copyFrom";
    eDiv.value = text;
    eBody.appendChild(eDiv);
    
    eDiv.select();
    document.execCommand('copy', true);
    eDiv.remove();
    
    showNotification(text);
}

function showNotification(sMessage)
{
    var opt = {
        type: "basic",
        title: getI18nMsg("copyToClipboard"),
        message: sMessage,
        iconUrl: "images/downloadButton.png"
    };
    
    chrome.notifications.create("", opt, function(id) {
       console.error(chrome.runtime.lastError);
    });
}

function getI18nMsg(msgname) {
    try {
        return chrome.i18n.getMessage(msgname)
    } catch (err) {
        return msgname
    }
};

String.prototype.hashCode = function() {
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return hash;
}

var L64B = {
	fVideoVersion: true,
	vars: {},
	startpage: {
		onMessage: function(details, sender, callback) {
			if (details.type == "__L64_SHOW_CHROME_SETTINGS") {
				chrome.tabs.create({
					"url": "chrome://settings",
					"selected": true
				}, function(tab) {});

			} else if (details.type == "__L64_NAVIGATE_CHROME_URL") {
				if (details.where == "newTab")
					chrome.tabs.create({
						"url": details.url,
						"selected": true
					}, function(tab) {});
				else
					chrome.tabs.update(null, {
						"url": details.url,
						"selected": true
					}, function(tab) {});
			}

			if (details.msg == "OnSP24GetVideoUrls") {
				if (callback) {
                    chrome.tabs.query({active: true}, function (arrayOfTabs) {
                        var tabId = arrayOfTabs[0].id;

                        chrome.tabs.get(details.tabId, function(tab) {
                            callback({
                                videoUrls: vdl.urllist[tabId],
                                titles: gasData[tabId].gasTitle,
                                picUrls: gasData[tabId].gasPicUrl,
                                fileNames: gasData[tabId].gasFileName,
                                videoIndex: gasData[tabId].giVideoIndex,
                                nowSite: gasData[tabId].giSite
                            })
                        });
                    });

					return true;
				}
			} else if (details.msg == "SetVideoIndex") {
                chrome.tabs.query({active: true}, function (arrayOfTabs) {
                    var tabId = arrayOfTabs[0].id;
                    
                    if (!gasData[tabId])
                    {
                        gasData[tabId] = new Object();
                    }

                    gasData[tabId].giVideoIndex = details.videoIndex;
                    console.log("[OVP]SetVideoIndex:" + gasData[tabId].giVideoIndex);
                });
				if (callback) {
					return true;
				}
			} else if (details.msg == "CopyText") {
                chrome.tabs.query({active: true}, function (arrayOfTabs) {
                    var tabId = arrayOfTabs[0].id;
                    
                    if (!gasData[tabId])
                    {
                        gasData[tabId] = new Object();
                    }
                    
                    gasData[tabId].giVideoIndex = details.videoIndex;
                    
                    var sText = details.text ? details.text : gasData[tabId].gasFileName[gasData[tabId].giVideoIndex];
                    
                    copyTextToClipboard(sText);
                    
                    console.log("[OVP]CopyText:" + sText);
                });
                
				if (callback) {
					return true;
				}
			} else if (details.msg == "SetTitleAndPicUrl") {
                chrome.tabs.query({active: true}, function (arrayOfTabs) {
                    var tabId = arrayOfTabs[0].id;

                    if (!gasData[tabId])
                    {
                        gasData[tabId] = new Object();
                    }
                    
                    if (details.titles)
                    {
                        gasData[tabId].gasTitle = details.titles;
                    }
                    if (details.picUrls)
                    {
                        gasData[tabId].gasPicUrl = details.picUrls;
                    }
                    if (details.fileNames)
                    {
                        gasData[tabId].gasFileName = details.fileNames;
                    }
                    if (details.nowSite)
                    {
                        gasData[tabId].giSite = details.nowSite;
                    }
                    console.log("[OVP][ID:" + tabId + "][SITE:" + gasData[tabId].giSite + "][setTitleAndPicUrl:" + gasData[tabId].gasTitle + "][" + gasData[tabId].gasPicUrl + "]");
                });
                
				if (callback) {
                    
					return true;
				}
			} else if (details.msg == "currentVideoInfo") {
				if (callback) {
					chrome.tabs.getSelected(undefined, function(tab) {
						callback(tab);
					});
					return true;
				}
			} else if (details.msg == "ClearVideoInfo") {
				//window.location.reload();
                gasData[tabId] = new Object();
				
				if (callback) {
					return true;
				}
			} else if (details.msg == "GetSiteId") {

				if (callback) {
                    chrome.tabs.query({active: true}, function (arrayOfTabs) {
                        var tabId = arrayOfTabs[0].id;

                        chrome.tabs.get(details.tabId, function(tab) {
                            callback({
                                nowSite: gasData[tabId].giSite
                            })
                        });
                    });

					return true;
				}
			}
		}
	},
	request: {
		lshorthistory: new Object()
	},
	search: {
		lastUrl: false,
		onSearchDetect: function(details) {
			if (L64B.search.lastUrl == details.url)
				return;
			L64B.search.lastUrl = details.url;
			console.log("--- new search url" + details.url);
		}
	}
}
chrome.extension.onMessage.addListener(L64B.startpage.onMessage);
