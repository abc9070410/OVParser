"use strict";

var gasTitle = new Array();
var gasPicUrl = new Array();
var gasFileName = new Array();
var giVideoIndex = -1;
var giSite = -1;


function copyTextToClipboard(text) {
    var eBody = document.getElementsByTagName("body")[0];
    var eDiv = document.createElement("textarea");
    eDiv.id = "copyFrom";
    eDiv.value = text;
    eBody.appendChild(eDiv);
    
    eDiv.select();
    document.execCommand('copy', true);
    eDiv.remove();
}


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
					chrome.tabs.get(details.tabId, function(tab) {
						callback({
							videoUrls: vdl.urllist[details.tabId],
                            titles: gasTitle,
                            picUrls: gasPicUrl,
                            fileNames: gasFileName,
                            videoIndex: giVideoIndex,
                            nowSite: giSite
						})
					});
					return true;
				}
			} else if (details.msg == "SetVideoIndex") {
                giVideoIndex = details.videoIndex;
                console.log("[OVP]SetVideoIndex:" + giVideoIndex);
				if (callback) {
					return true;
				}
			} else if (details.msg == "CopyText") {
                giVideoIndex = details.videoIndex;
                
                var sText = details.text ? details.text : gasFileName[giVideoIndex];
                
                copyTextToClipboard(sText);
                
                console.log("[OVP]CopyText:" + sText);
				if (callback) {
					return true;
				}
			} else if (details.msg == "SetTitleAndPicUrl") {
                gasTitle = details.titles;
                gasPicUrl = details.picUrls;
                gasFileName = details.fileNames;
                giSite = details.nowSite;
                console.log("[OVP][setTitleAndPicUrl:" + gasTitle + "][" + gasPicUrl + "]");
                
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
				window.location.reload();
				
				if (callback) {
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