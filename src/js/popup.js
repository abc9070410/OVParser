"use strict";

var fVideoVersion = false;
var fSearchIsOn = false;

var gasTitle = [];
var gasPicUrl = [];
var gasFileName = [];
var giVideoIndex = -1;

var SITE_TWDVD = 1;
var SITE_YOUTUBE = 2;
var SITE_XUITE = 3;
var SITE_ADULTCITY = 4;
var SITE_EROPPY = 5;
var SITE_BLOGGER = 6;
var SITE_BILIBILI = 7;
var SITE_XXXFK = 8;
var SITE_THISAV = 9;
var SITE_FACEBOOK = 10;
var SITE_OTHER = 99;
var giSite = SITE_OTHER;



function addRadioEvent()
{
    for (var i = 0; i < gasTitle.length; i ++ )
    {
        document.addEventListener('change', changeHandler, false);
    }
}


function getRadioItem()
{
    var sInner = "";
    
    sInner += "<form>";
    for (var i = 0; i < gasTitle.length; i ++)
    {
        sInner += "<input type='radio' name='radioName' class='radioTitle' onclick='handleRadioClick(this);' value='" + i + "'>" + gasTitle[i] + "</input><br>";
    }
    sInner += "</form>";
    
    
    return sInner;
}

function handleRadioClick(eRadio)
{
}


function GetFileExtension(ob) {
    var ext = ["flv", "mp4", "3g", "wmv", "mpg", "m4p", "m4v"];
    for (var j = 0; j < ext.length; j++) {
        if (ob.mime.indexOf(ext[j]) >= 0) {
            return ext[j];
        }
    }
    for (var j = 0; j < ext.length; j++) {
        if (ob.url & ob.url.toLowerCase().indexOf("." + ext[j]) >= 0) {
            return ext[j];
        }
    }
    return "flv";
}


function OnSP24NavigateVideo() {
}

function getFilename(d) {
    var s = "";
    for (var j = 0; j < d.title.length; j++) {
        var c = d.title.charAt(j);
        if (c >= 'A' && c <= 'Z')
            s += c;
        else if (c >= 'a' && c <= 'z')
            s += c;
        else if (c >= '0' && c <= '9')
            s += c;
        else if ("- _()".indexOf(c) >= 0)
            s += c;
    }
    s += "." + GetFileExtension(d);
    return s;
}

var curTabId = 0;
var videoUrls = 0;

function showVideoUrls() {
    var sCoverUrl = null;
    var sInner = "";
    if (!videoUrls) {
        sInner += getRadioItem();
        
    }
    if (videoUrls) {
        for (var i = 0; i < videoUrls.length; i++) {
            var ob = videoUrls[i];
            var url = ob.url;
            var ext = GetFileExtension(ob);
            if (!i)
                sInner += "<div class='sep'></div><div class='clHeader'>" + getI18nMsg("idVDL") + "</div>";
            else
                sInner += "<div class='sep2'></div>";
            var color = "#aaa";
            if (ext == "flv")
                color = "#73A";
            else if (ext == "mp4" || ext == "mp4" || ext == "m4v")
                color = "#58d";
            else if (ext == "3g")
                color = "#faa";
            else if (ext == "wmv")
                color = "#aff";

            sInner += "<div class='wrap'><div class='clFileExt' style='background-color:" + color + "'>" + ext + "</div>";
            
            if (ob.len > 0)
            {
                var iVideoSize = Math.floor(ob.len * 10 / 1024 / 1024) / 10;
                sInner += "<div class='wrap' style=''><div class='clFileExt' style='background-color:" + color + "555'>" + iVideoSize + " MB</div>";
            }
                

            if (giVideoIndex < 0)
            {
                sInner += "<b>" + getI18nMsg("choiceCurrentVideoTitle") + ": " + "</b><hr>";
                sInner += getRadioItem();
            }
            else
            {
                var sTitle = gasTitle[giVideoIndex];
                
                var sFileName = gasFileName[giVideoIndex] + "." + ext;
                
                if (giSite == SITE_BILIBILI)
                {
                    //sFileName = ob.title;
                }

                sInner += "<b>&nbsp;&nbsp;&nbsp;" + sFileName + "</b><br>"
                sInner += "<div>";
                sInner += "&nbsp;&nbsp;&nbsp;<a type='button' id='downloadID' value='Download' href='" + url + "' download='" + sFileName + "'>" + getI18nMsg("downloadVideo") + "</a>";
                sInner += "</a>";
                
                if (giSite == SITE_TWDVD)
                {
                    sInner += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    sInner += "<a type='button' href='#' id='goBackID' >" + getI18nMsg("rechoice") + "</a>";
                }
                sInner += "</div>";
                sInner += "<hr>";
                
                if (ob.cover)
                {
                    sCoverUrl = ob.cover;
                    console.log("[OVP]Cover found:" + sCoverUrl);
                }
            }
        }
        
        var sPicUrl;
        if (gasPicUrl[giVideoIndex])
        {
            sPicUrl = gasPicUrl[giVideoIndex];
        }
        else if (sCoverUrl)
        {
            sPicUrl = sCoverUrl;
        }
        
        if (sPicUrl)
        {
            sInner += "<img src='" + sPicUrl + "' style='width:100%; height:100%;' ></img>";
        }
    }
    var o = document.getElementById("idVideos");
    if (o) {
        o.innerHTML = sInner;
    }
    
    var eDown = document.getElementById("downloadID");
    var eGoBack = document.getElementById("goBackID");
    var aeRadio = document.getElementsByClassName("radioTitle");
    
    if (eDown)
    {
        eDown.addEventListener('click', clickDownload, false);
    }
    if (eGoBack)
    {
        eGoBack.addEventListener('click', clickGoBack, false);
    }
    else if (aeRadio)
    {
        for (var i = 0; i < aeRadio.length; i ++)
        {
            aeRadio[i].index = i;
            aeRadio[i].addEventListener('change', clickRadio, false);
        }
    }
    else
    {
        console.log("[OVP]:NON");
    }
}

function clickDownload()
{
    if (giSite == SITE_BILIBILI)
    {
        return; // do nothing cause there exists multiple videos
    }

    setTimeout(reloadPage, 500); // reload page after n seconds
    setTimeout(closePopWindow, 1500); // close the pop menu after n seconds
}

function reloadPage()
{
    // reload this page for stopping the video
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var code;
        
        if (giSite == SITE_TWDVD)
        {
            code = 'window.location.reload();';
        }
        else
        {
            code = 'history.back();';
        }
    
        chrome.tabs.executeScript(arrayOfTabs[0].id, {code: code});
        clearVideoInfo();
    });
}

function closePopWindow()
{
    window.close();
}

function clickRadio(event)
{
    giVideoIndex = event.target.index;
    showVideoUrls();
}

function clickGoBack()
{
    giVideoIndex = -1;
    showVideoUrls();
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("[OVP]popup DOMContentLoaded");
  
    var query = window.location.search.substring(1);
    console.log(query, 11, window.location.search);
    var popupText = ["idvideo"];
    for (i = 0; i < popupText.length; i++) {
        var ob = document.getElementById(popupText[i]);
        if (ob)
            ob.innerHTML = getI18nMsg(popupText[i]);
    }

    var j = query.indexOf("&tabid=");
    if (j >= 0)
        curTabId = parseInt(query.slice(j + 7));
    chrome.extension.sendMessage({
        msg: "OnSP24GetVideoUrls",
        tabId: curTabId
    }, function(response) {
        videoUrls = response.videoUrls;
        gasTitle = response.titles;
        gasPicUrl = response.picUrls;
        gasFileName = response.fileNames;
        //giVideoIndex = response.videoIndex;
        giSite = response.nowSite;
        
        // show download link directly if there is only one video
        if (!gasTitle.length || gasTitle.length == 1)
        {
            giVideoIndex = 0;
        }

        showVideoUrls();
    });

    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].className == "vdlButton") {
        } else if (divs[i].className == "idvideo") {
            //Show video list
            if (divs[i].id == "idvideo")
                divs[i].addEventListener('click', OnSP24NavigateVideo);
        }
    }
});

function getI18nMsg(msgname) {
    try {
        return chrome.i18n.getMessage(msgname)
    } catch (err) {
        return msgname
    }
};

function clearVideoInfo() {
    chrome.extension.sendMessage({
        msg: "ClearVideoInfo"
    }, function(response) {});
}