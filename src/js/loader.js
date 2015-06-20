"use strict";

var SITE_TWDVD = 1;
var SITE_YOUTUBE = 2;
var SITE_XUITE = 3;
var SITE_ADULTCITY = 4;
var SITE_EROPPY = 5;
var SITE_BLOGGER = 6;
var SITE_BILIBILI = 7;
var SITE_XXXFK = 8;
var SITE_THISAV = 9;
var SITE_OTHER = 99;
var giSite = SITE_OTHER;

initLoader();
//document.addEventListener('DOMContentLoaded', initLoader);
window.onload = onloadAndReloadCheck;

function initLoader()
{
    setSite();

    setPopWindowSize();
    setTitleAndPicUrl();
    
    if (giSite == SITE_TWDVD)
    {
        addDownloadPicButton();
    }
}

function onloadAndReloadCheck()
{
    
}

function setSite()
{
    var sUrl = window.location.href;
    
    if (sUrl.indexOf("twdvd.") > 0)
    {
        giSite = SITE_TWDVD;
    }
    else if (sUrl.indexOf("youtube.") > 0)
    {
        giSite = SITE_YOUTUBE;
    }
    else if (sUrl.indexOf("xuite.") > 0)
    {
        giSite = SITE_XUITE;
    }
    else if (sUrl.indexOf("adultcity.to") > 0)
    {
        giSite = SITE_ADULTCITY;
    }
    else if (sUrl.indexOf("eroppy.com") > 0)
    {
        giSite = SITE_EROPPY;
    }
    else if (sUrl.indexOf("blogspot.com") > 0)
    {
        giSite = SITE_BLOGGER;
    }
    else if (sUrl.indexOf("bilibili.com") > 0)
    {
        giSite = SITE_BILIBILI;
    }
    else if (sUrl.indexOf("xxxfk.com") > 0)
    {
        giSite = SITE_XXXFK;
    }
    else if (sUrl.indexOf("thisav.com") > 0)
    {
        giSite = SITE_THISAV;
    }
    else
    {
        giSite = SITE_OTHER;
    }
    
    console.log("[OVP]SetSite:" + giSite + " [" + sUrl + "]");
}

function removeSpecificCh(sText)
{
    return sText;
    //return sText.replace(/:|*|?|<|>/, "");
}

// ex. 1rct709pl -> RCT-709
//     kawd621pl -> KAWD-621
//     piz444    -> PIZ-444
function getSerialNumber(sPicUrl, sTitle)
{
    var asTemp = sPicUrl.split("/");
    var sTemp = asTemp[asTemp.length-1];
    
    if (sTemp.indexOf("pl.jpg") > 0)
    {
        var iOffset = 6;
        if (sTemp.indexOf("sopl.jpg") > 0)
        {
            iOffset = 8;
        }
    
        sTemp = sTemp.substring(0, sTemp.length - iOffset);
        var iFirstChIndex = 0; 
        var iLastChIndex = -1;
        var i;
        for (i = sTemp.length - 1; i >= 0; i --)
        {
            var s = sTemp.substring(i, i + 1);

            if (iLastChIndex < 0 && isNaN(s))
            {
                iLastChIndex = i + 1;
            }
            
            if (iLastChIndex > 0 && s.match(/[^a-zA-Z]+/))
            {
                iFirstChIndex = i + 1;
                break;
            }
            
        }
        
        if (iLastChIndex >= 0)
        {
            return sTemp.substring(iFirstChIndex, iLastChIndex) + "-" + 
               sTemp.substring(iLastChIndex, sTemp.length);
        }
    }
    
    var sSecondChoice = "";
    var bMarkExisted = false;
    var bPureNumber = false;
    var bNumberExisted = false;
    
    asTemp = sTitle.split(/\s|】|「|『/);
    
    for (var i = 0; i < asTemp.length; i ++)
    {
        sTemp = asTemp[i].toLowerCase();
    
        if (sTemp.indexOf("mura") >= 0 ||
            sTemp.indexOf("eydouga") >= 0 ||
            sTemp.indexOf("ppv") >= 0 ||
            sTemp.indexOf("tokyo") == 0 ||
            sTemp.indexOf("hot") == 0 ||
            sTemp.indexOf("red") == 0 ||
            sTemp.indexOf("jam") == 0 ||
            
            sTemp.indexOf("zipang") >= 0 ||
            sTemp.indexOf("x-a-") >= 0 ||
            sTemp.indexOf("メス豚") >= 0 ||
            sTemp.indexOf("一本道") >= 0 ||
            sTemp.indexOf("加勒比") >= 0 ||
            sTemp.indexOf("premium") >= 0 ||
            sTemp.indexOf("catcheye") >= 0 ||
            sTemp.indexOf("天然素人") >= 0 ||
            sTemp.indexOf("ス豚") == 0 ||
            sTemp.indexOf("pacopacomama") == 0 ||
            sTemp.indexOf("ガチん娘") >= 0)// ||  
            //sTemp.match("s"))
        {
            sSecondChoice += asTemp[i] + " ";
            bMarkExisted = true;
        }
        else if (sTemp.indexOf("kirari") >= 0 ||
            sTemp.indexOf("1000人斬") == 0 ||
            sTemp.indexOf("金8天國") == 0 ||
            sTemp.indexOf("金8天国") == 0 ||
            sTemp.indexOf("亞洲天國") == 0 ||
            sTemp.indexOf("honnamatv") == 0 ||
            sTemp.indexOf("heyzo") >= 0 ||
            sTemp.indexOf("model") == 0 ||
            sTemp.indexOf("real-diva") == 0 ||
            sTemp.indexOf("x-art") == 0 ||
            sTemp.indexOf("xxx-av") == 0) //  
        {
            sSecondChoice += asTemp[i] + " ";
            bMarkExisted = true;
            bPureNumber = true;
        }
        else if (bMarkExisted && !bNumberExisted)
        {
            if (sTemp.match(/[0-9]+_[0-9]+_*[0-9]*/) ||
                sTemp.match(/[0-9]+-[0-9]+/) ||
                sTemp.match(/[a-z]+[0-9]+/) ||
                (!bPureNumber && sTemp.indexOf("vol") == 0) ||
                (bPureNumber && sTemp.match(/[0-9]+/) && 
                 sTemp.indexOf("vol") < 0 && 
                 sTemp.indexOf("天國") < 0 &&
                 sTemp.indexOf("歲") < 0)
               )
            {
                sSecondChoice += asTemp[i];
                bNumberExisted = true;
            }
        }
    }
    
    if (bMarkExisted)
    {
        return sSecondChoice;
    }
    
    return "NONE";
}

function getAllFileName(asTitle, asPicUrl)
{
    var asFileName = new Array();
    var i;
    
    if (giSite == SITE_TWDVD)
    {
        for (i = 0; i < asTitle.length; i ++)
        {
            var sSerialNumber = getSerialNumber(asPicUrl[i], asTitle[i]);
            var sTemp = sSerialNumber.replace(/-/g, " ");
            var sTitle = asTitle[i].replace(sSerialNumber, "").replace(sTemp, "");
            
            sSerialNumber = sSerialNumber.toUpperCase().replace(/\s/g, "_").replace(/_/g, "-");
            
            asFileName[i] = removeSpecificCh(sSerialNumber + sTitle).trim();
        }
    }
    else
    {
        for (i = 0; i < asTitle.length; i ++)
        {
            asFileName[i] = asTitle[i].trim() + ".flv";
        }
    }
    
    console.log("[OVP]getAllFileName:" + asFileName);
    
    return asFileName;
}

function setTitleAndPicUrl()
{
    var asTitle = getAllTitle();
    var asPicUrl = getAllPicUrl();
    var asFileName = getAllFileName(asTitle, asPicUrl);
    
    chrome.extension.sendMessage({
      msg: "SetTitleAndPicUrl",
      titles: asTitle,
      picUrls: asPicUrl,
      fileNames: asFileName,
      nowSite: giSite
    }, function(response) {
      
    });
}

function addDownloadPicButton()
{
    var asPicUrl = getAllPicUrl();
    var asTitle = getAllTitle();
    var asFileName = getAllFileName(asTitle, asPicUrl);
    var aeTitle = document.getElementsByClassName("blog_subject");

    for ( var i = 0; i < asPicUrl.length; i ++ )
    {
        var asTemp = asPicUrl[i].split("/");
        var sFileName = asFileName[i];//asTitle[i] + asTemp[asTemp.length-1];

        var eDiv = document.createElement("a");
        eDiv.href = asPicUrl[i];
        eDiv.download = sFileName;
        eDiv.innerHTML = ">&nbsp;下載封面(按右鍵另存新檔)&nbsp;<";
        //eDiv.innerHTML = "<a download='" + sFileName + "' href='" + asPicUrl[i] + "' >>>&nbsp;下載封面&nbsp;<<</a>";
        eDiv.iVideoIndex = i;
        eDiv.addEventListener('touchstart', clickVideo, false);
        eDiv.addEventListener('click', clickVideo, false);
        aeTitle[i].appendChild(eDiv);
        
        var eDiv = document.createElement("div");
        eDiv.innerHTML = "<hr>格式化檔名 : <u>" + sFileName + "</u>";
        aeTitle[i].appendChild(eDiv);
    }
}

function setPopWindowSize()
{
    if (giSite != SITE_TWDVD)
    {
        var aeDiv = document.getElementsByClassName("wrap");
        
        for ( var i = 0; i < aeDiv.length; i ++ )
        {
            aeDiv[i].style.height = "100px";
        }
    }
}

function getAllTitle()
{
    var asTitle = new Array();

    if (giSite == SITE_YOUTUBE)
    {
        // do nothing
    }
    else if (giSite == SITE_TWDVD)
    {
        var aeTitle = document.getElementsByClassName("blog_subject");
        
        for ( var i = 0; i < aeTitle.length; i ++ )
        {
            var sHTML = aeTitle[i].innerHTML;
            var iBegin = sHTML.indexOf("<b>") + 3;
            var iEnd = sHTML.indexOf("</b>", iBegin);
            asTitle[i] = sHTML.substring(iBegin, iEnd);
        }
    }
    else if (giSite == SITE_XUITE)
    {
        var sSplitToken = " @ ";
        
        aeTitle = document.getElementsByTagName("title");

        if (aeTitle.length)
        {
            var sHTML = aeTitle[0].innerHTML.split(sSplitToken)[0];
            var iBegin = 0
            var iEnd = sHTML.length;
            asTitle[0] = sHTML.substring(iBegin, iEnd);
        }
    }
    else if (giSite == SITE_ADULTCITY)
    {
        var aeTitle = document.getElementsByClassName("comment_left");
        
        for ( var i = 0; i < aeTitle.length; i ++ )
        {
            var sHTML = aeTitle[i].innerHTML;
            var iBegin = sHTML.indexOf("<p>") + 3;
            var iEnd = sHTML.indexOf("</p>", iBegin);
            asTitle[i] = sHTML.substring(iBegin, iEnd);
        }
    }
    else if (giSite == SITE_EROPPY)
    {
        var aeTitle = document.getElementsByTagName("title");
        
        for ( var i = 0; i < aeTitle.length; i ++ )
        {
            asTitle[i] = aeTitle[i].innerHTML;
        }
    }
    else if (giSite == SITE_BLOGGER)
    {
        var aeTitle = document.getElementsByTagName("h3");
        
        if (aeTitle.length)
        {
            asTitle[0] = aeTitle[0].innerHTML.replace("[美式卡通翻譯]", "");
        }
    }
    else if (giSite == SITE_XXXFK)
    {
        var eTitle = document.getElementsByTagName("title")[0];
        asTitle[0] = eTitle.innerHTML.split(" - ")[0].replace("Watch Online", "").trim();
        sendCopyText(asTitle[0], 0);
    }
    else if (giSite == SITE_BILIBILI)
    {
        var sUrl = window.location.href;
        var eTitle = document.getElementsByTagName("title")[0];
        asTitle[0] = eTitle.innerHTML.split("_")[0].trim();
        
        if (sUrl.indexOf("/video/") > 0)
        {
            sendCopyText(asTitle[0], 0);
        }
    }
    else
    {
        var sSplitToken = " - ";
        var aeTitle = document.getElementsByTagName("title");

        if (aeTitle.length)
        {
            var sHTML = aeTitle[0].innerHTML.split(sSplitToken)[0];
            var iBegin = 0;
            var iEnd = sHTML.length;
            asTitle[0] = sHTML.substring(iBegin, iEnd).trim();
        }
        
       
    }
    
    console.log("[OVP]getAllTitle:" + asTitle);
    
    return asTitle;
}

function getAllPicUrl()
{
    var asPic = [];
    
    if (giSite == SITE_TWDVD)
    {
        var aePic = document.getElementsByClassName("blog_body");
        
        for ( var i = 0; i < aePic.length; i ++ )
        {
            var sHTML = aePic[i].innerHTML;
            var iBegin = sHTML.indexOf("image=") + 6;
            var iEnd = sHTML.indexOf("\"", iBegin);
            asPic[i] = sHTML.substring(iBegin, iEnd);
            
        }    
    }
    else if (giSite == SITE_BILIBILI)
    {
        var eDiv = document.getElementsByClassName("cover_image")[0];
        asPic[0] = eDiv.src;
    }
    else if (giSite == SITE_EROPPY)
    {
        var eDiv = document.getElementsByClassName("rating-bar-container")[0];
        
        if (eDiv)
        {
            var sTemp = eDiv.innerHTML;
            var iBegin = sTemp.indexOf("http");
            var iEnd = sTemp.indexOf("\"", iBegin);
            asPic[0] = sTemp.substring(iBegin, iEnd);
        }
    }
    else if (giSite == SITE_THISAV)
    {
        var sUrl = window.location.href;
        var asTemp = sUrl.split("/video/");
        
        var sTag = null;
        if (asTemp.length == 2)
        {
            sTag = asTemp[1].split("/")[0];
            asPic[0] = "http://images.thisav.com/images/videothumbs/" + sTag + "-1.jpg";
        }
    }

    console.log("[OVP] Cover:" + asPic);
    
    return asPic;
}

function setVideoIndex(index)
{
    chrome.extension.sendMessage({
      msg: "SetVideoIndex",
      videoIndex: index
    }, function(response) {
      
    });
}

function clickVideo(event)
{
    setVideoIndex(event.target.iVideoIndex);
    sendCopyText(null, event.target.iVideoIndex);
}

function sendCopyText(sText, iVideoIndex)
{
    chrome.extension.sendMessage({
      msg: "CopyText",
      videoIndex: iVideoIndex,
      text: sText
    }, function(response) {
      
    });
}
