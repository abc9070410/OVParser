﻿var giNowTabId = 0;
var gsCoverUrl = null;
var gsNowUrl = "";
var gbHLSExisted = false;

L64B.video = {
    checkForValidUrl: function(tabId, changeInfo, tab) {
        //chrome.pageAction.show(tabId);
        return;
    },
    onUpdateTabCalled: false,
    onUpdateTab: function(tabId, changeInfo, tab) {
        if (!tab)
            return;

        if (vdl.urllist[tab] || L64B.video.onUpdateTabCalled)
        {
        //    return;
        }
        
        L64B.video.onUpdateTabCalled = true;
        popupHTML = "popup.html?";
        
        log(" Update Tab");
        initVariables();

        if (L64B.fVideoVersion)
            popupHTML += "&version=video";
            
        popupHTML += "&tabid=" + tabId;

        chrome.browserAction.setPopup({
            tabId: tab.id,
            popup: popupHTML
        });
        //chrome.browserAction.show(tab.id);  
    }
}

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(L64B.video.onUpdateTab);

/* 20160205
setTimeout(function() // make sure onUpdateTab is called at least once
    {
        if (!L64B.video.onUpdateTabCalled) {
            chrome.tabs.getSelected(undefined, function(tab) {
                L64B.video.onUpdateTab(tab.id, null, tab);
            });
        }
    }, 200);
*/
    
var vdl = {
    parentUrls: new Object(),
    lasturl: new Object(),
    videolist: new Object(),
    urllist: new Object(),
    urlPlaying: new Object(),
    downloadlist: new Object(),
    statlist: new Object(),
    enableSMIL: true,
    mainWindow: false,
    videoHandler: [{
            mime: "flv",
            urlParts: [""],
            isVideo: true,
            p: 1
        }, {
            mime: "mp4",
            urlParts: [""],
            isVideo: true,
            p: 1
        }, {
            mime: "plain",
            urlParts: ["youporn", ".flv"],
            isVideo: true,
            p: 1
        }, {
            mime: "plain",
            urlParts: ["xvideos.com", ".flv?"],
            isVideo: true,
            p: 1
        }, /*{
            mime: "plain",
            urlParts: ["youtube.com", "videoplayback", "range"],
            isVideo: true,
            p: 1
        }, */{
            mime: "m4v",
            urlParts: [""],
            isVideo: true,
            p: 1
        }, {
            mime: "text/xml",
            urlParts: ["interface.bilibili.com", "playurl"],
            isVideo: true,
            p: 1
        }, {
            mime: "nosniff",
            urlParts: ["googlevideo.com", "videoplayback"],
            isVideo: true,
            p: 1
        }, {
            mime: "application/octet-stream",
            urlParts: [".flv"],
            isVideo: true,
            p: 1
        }, {
            mime: "video/",
            urlParts: [""],
            isVideo: true,
            p: 1
        }
    ],

    launch: function(details) {
        if (details.tabId < 0) {
            vdl.lasturl[details.tabId] = "";
            vdl.videolist[details.tabId] = false;
            vdl.urllist[details.tabId] = false;
            vdl.statlist[details.tabId] = false;
            log("launch 1 : init video info");
            return;
        }
        chrome.tabs.get(details.tabId, function(tab) {
            if (tab && vdl.lasturl[details.tabId] != tab.url) {
                vdl.lasturl[details.tabId] = tab.url;
                vdl.videolist[details.tabId] = false;
                vdl.urllist[details.tabId] = false;
                vdl.statlist[details.tabId] = false;
                log("launch 2 : init video info");
            }
        });
        return;
    },

    launchc: function(tab) {
        vdl.videolist[tab.id] = false;
        vdl.urllist[tab.id] = false;
        vdl.statlist[tab.id] = false;
        log("launchc : init video info");
        return;
    },

    launchcw: function(window) {
        return;
    },

    launchu: function(id, change, tab) {
        vdl.lasturl[id] = tab.url;
        vdl.videolist[id] = false;
        vdl.urllist[id] = false;
        vdl.statlist[id] = false;
        log("launchu : init video info[" + id + "]");
        gsNowUrl = tab.url;
        
        return;
    },

    before: function(details) {
    },
    checkObject: function(details) {
        // if (details.type == "object")
        var type = false;
        var len = 0;
        var isVideo = true;
        var priority = 0;
        var bNeedGetPlayUrl = false;
        var bNoLength = false;
        
        for (var i = 0; i < details.responseHeaders.length; ++i) {

            //log("Name:" + details.responseHeaders[i].name + "  MINE:" + details.responseHeaders[i].value + "  URL:" + details.url);
        
            if (details.responseHeaders[i].name.toLowerCase() === 'content-type' ||
                details.responseHeaders[i].name === "x-content-type-options") {
                var mime = details.responseHeaders[i].value;
                var url = details.url;
                
                //log("Content-Type: MIME:" + mime + "  URL:" + url);
                
                //if (url.indexOf("videoplayback") > 0) alert(url);
                
                for (var xInfo = 0; xInfo < vdl.videoHandler.length; ++xInfo) {
                    var comp = vdl.videoHandler[xInfo].mime;
                    if (mime.indexOf(comp) != -1) {
                        type = mime;
                        var parts = vdl.videoHandler[xInfo].urlParts
                        for (var xparts = 0; xparts < parts.length; xparts++) {
                            find = parts[xparts];
                            if (url.indexOf(find) == -1)
                                type = false;
                        }
                        if (type != false) {
                            isVideo = vdl.videoHandler[xInfo].isVideo;
                            priority = vdl.videoHandler[xInfo].p
                            
                            if (mime.indexOf("text/xml") >= 0)
                            {
                                bNeedGetPlayUrl = true;
                            }
                            else if (mime.indexOf("nosniff") >= 0)
                            {
                                bNoLength = true;
                            }
                            
                            
                            log("This is video:" + url);
                            
                            break;
                        }
                    }
                }
                
                if (mime.indexOf("image/") != -1)
                {
                    if (url.indexOf("/media/") > 0) // SITE_XUITE
                    {
                        gsCoverUrl = url;
                        log("CoverUrl:" + gsCoverUrl);
                    }
                }
                
                if (/*!gbHLSExisted &&*/ url.indexOf(".m3u8") > 0)
                {
                    gbHLSExisted = true;
                    
                    console.log("found HLS : " + url);
                    
                    chrome.tabs.sendMessage(
                        details.tabId, {
                            greeting: "SetBatchButton",
                            url: url,
                            tabId: details.tabId
                        }, 
                        function(response) {
                    });
                }
            }
            if (details.responseHeaders[i].name.toLowerCase() === 'content-length')
            {
                len = details.responseHeaders[i].value;
                //log("Content-Length: LEN:" + len);
            }
        }
        
        if (type)
        {
            log("->Content-Type: MIME:" + mime + "  URL:" + url);
            log("->Content-Length: LEN:" + len);
        }

        if (bNeedGetPlayUrl && !vdl.urllist[details.tabId])
        {
            log("bNeedGetPlayUrl:" + details.url);
            giNowTabId = details.tabId;
            
            var xmlHttpReq = new XMLHttpRequest();
            xmlHttpReq.onreadystatechange = parsePlayUrl;
            xmlHttpReq.open("GET", details.url, true);
            xmlHttpReq.send();
            
            xmlHttpReq.oDetails = details;
            xmlHttpReq.oVdl = vdl;
        }
        else if (type !== false && 
                 (bNeedGetPlayUrl || bNoLength || (len > 1024) || !isVideo) &&
                 !isYoutube()) // do not parse youtube 
        {
            vdl = foundValidVideo(details, vdl, type, priority, len, null, null, gsCoverUrl);
            
            gsCoverUrl = null;
        }
        
        var filename = vdl.downloadlist[details.url];
        if (filename) {
            for (var i = 0; i < details.responseHeaders.length; ++i) {
                if (details.responseHeaders[i].name && details.responseHeaders[i].name.toLowerCase() == 'content-disposition') {
                    details.responseHeaders[i].value = "attachment; filename=\"" + filename + "\"";
                }
            }
            var h = {
                name: "Content-Disposition",
                value: "attachment; filename=\"" + filename + "\""
            };
            details.responseHeaders.push(h);
            return {
                responseHeaders: details.responseHeaders
            };
        }
    }
}

function isYoutube()
{
    return (gsNowUrl.indexOf("youtube.com") > 0);
}

function foundValidVideo(details, vdl, type, priority, len, sParsedUrl, sParsedTitle, sCoverUrl)
{
    vdl.statlist[details.tabId] = 1;
    if (!vdl.urllist[details.tabId])
    {
        vdl.urllist[details.tabId] = new Array();
        log("foundValidVideo : init video info");
    }
    
    var fAddToList = true;
    var tabid = details.tabId;
    for (var i = 0; i < vdl.urllist[tabid].length; i++) {
        if (vdl.urllist[tabid][i].url == details.url) {
            fAddToList = false; // allready in
            chrome.browserAction.setIcon({
                tabId: tabid,
                path: "../images/logo19.png"
            });
            break;
        }
    }
    if (fAddToList && tabid >= 0) {
        chrome.tabs.get(tabid, function(tab) {
            
            if (tab) {
                var sURL = details.url;
                var sTitle = tab.title;
                
                if (sParsedUrl)
                {
                    sURL = sParsedUrl;
                }
                
                if (sParsedTitle)
                {
                    sTitle = sParsedTitle;
                }
                
                log("Title:" + sTitle + "  VideoUrl:" + sURL + "  CoverUrl:" + sCoverUrl);
                
                vdl.urllist[tabid].splice(0, 0, {
                    url: sURL,
                    mime: type,
                    p: priority,
                    len: len,
                    title: sTitle,
                    cover: sCoverUrl
                });
                
                log("Set vdl.urllist[" + tabid + "]");
                
                //sendVideoInfo(tabid);
                
                
                chrome.browserAction.setIcon({
                    tabId: tab.id,
                    path: "../images/logo19.png"
                });
                
                //highlight the icon if there exists videos
                if (vdl.urllist[tabid].length > 0) {
                    chrome.browserAction.setBadgeText(
                        {text:vdl.urllist[tabid].length.toString(), tabId:tabid}
                    ); // show the video count
                    chrome.browserAction.setTitle(
                        {title:"detect videos to download", tabId:tabid}
                    );
                }
            }
        });
    }
    
    return vdl;
}

function sendVideoInfo(iTabId)
{
    log("sendVideoInfo");
    chrome.extension.sendMessage({
        msg: "SendVideoInfoToBackground",
        tabId: iTabId
    }, function(response) {
    });
}

function parsePlayUrl()
{
    if (this.readyState != 3)
        return;
    
    //log("GET1[" + this.readyState + "]:" + this.responseText);
    
    var asTemp = this.responseText.split("<url>");
    var asUrl = [];
    
    for (var i = 0; i < asTemp.length - 1; i ++)
    {
        var sTemp = asTemp[i + 1];
        
        var iBegin = sTemp.indexOf("http://");
        var iEnd = sTemp.indexOf("]]>", iBegin);
        asUrl[i] = sTemp.substring(iBegin, iEnd).trim();
        
        iEnd = asUrl[i].indexOf("?");
        iBegin = asUrl[i].lastIndexOf("/", iEnd) + 1;
        
        var sTitle;
        if (iEnd > iBegin)
        {
            sTitle = asUrl[i].substring(iBegin, iEnd).trim();
        }
        else 
        {
            var asTemp2 = asUrl[i].split("/");
            sTitle = asTemp2[asTemp2.length - 1].trim();
        }
        var sTitle = "_Part" + (i+1) + "_" + sTitle;
        
        //log("" + (i + 1) + "  Title:" + sTitle + "  Url:" + asUrl[i]);
        
        foundValidVideo(this.oDetails, this.oVdl, "mp4", 1, 1024, asUrl[i], sTitle, null);
    }
    
    //vdl.urllist[giNowTabId] = asUrl;

    log("ParsePlayUrl:" + asUrl);
}

function initVariables()
{
    giNowTabId = 0;
    gsCoverUrl = null;
    gsNowUrl = "";
    gbHLSExisted = false;
}

function log(sText)
{
    console.log("[OVP.V]" + sText);
}

chrome.webRequest.onHeadersReceived.addListener(vdl.checkObject, {
    urls: ["<all_urls>"]
}, ["blocking", "responseHeaders"]);

chrome.webRequest.onCompleted.addListener(vdl.launch, {
    urls: ["<all_urls>"],
    types: ["main_frame"]
});
chrome.webRequest.onBeforeRequest.addListener(vdl.before, {
    urls: ["<all_urls>"]
});

chrome.windows.getCurrent(function(window) {
    vdl.mainWindow = window.id;
});

//chrome.tabs.onUpdated.addListener(vdl.launchu);
chrome.tabs.onCreated.addListener(vdl.launchc);
chrome.windows.onCreated.addListener(vdl.launchcw);

