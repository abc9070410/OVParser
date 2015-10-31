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
var SITE_FACEBOOK = 10;
var SITE_XVIDEO = 11;
var SITE_A9AV = 12;
var SITE_JKF = 13;
var SITE_85ST = 14;
var SITE_AVYAHOO = 15;
var SITE_HICHANNEL = 16;
var SITE_STREAMINTO = 17;
var SITE_OTHER = 99;
var giSite = SITE_OTHER;

var gasExternID = [];


var RESPONSE_NEED_CLICK_BUTTON = "5566";
var RESPONSE_FILE_DELETED = "5577";

initLoader();
//document.addEventListener('DOMContentLoaded', initLoader);
window.onload = onloadAndReloadCheck;

function initData()
{
    chrome.extension.sendMessage({
      msg: "InitData"
    }, function(response) {
      
    });
}

function initLoader()
{
    initData();
    addListener();

    setSite();

    setPopWindowSize();
    setTitleAndPicUrl();
    
    if (giSite == SITE_TWDVD)
    {
        addDownloadPicButton();
    }
    else
    {
        addExternLinkButton();
    }
}

function addListener()
{
    chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.greeting == "SetBatchButton")
            {
                log("SetBatchButton HLS : " + request.url);
                
                var eDiv = document.getElementById("BATCH_FILE_ID");
                if (eDiv)
                {
                    eDiv.remove();
                }

                var eTitle = document.getElementsByTagName("h1")[0];
                var sFileName = getAllTitle()[0];
                var sTitle = "▣ 串流影音 (以VLC開啟) ▣";
                
                if (!eTitle)
                {
                    eTitle = document.getElementsByTagName("p")[0];
                }
                
                if (giSite = SITE_HICHANNEL)
                {
                    eTitle = document.getElementById("titleName");
                    //eTitle = document.getElementsByClassName("maincontent")[0];
                    eDiv = document.getElementsByClassName("name")[0];
                    sFileName = eDiv.innerHTML.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '').trim();
                    
                    sTitle =  "▣ " + sFileName + "(以VLC開啟) ▣";
                }
                
                log("HLS Batch FileName:" + sFileName);

                var sCommand = getHLSBatchText(request.url);
                
                
                addBatchFileButton(eTitle, sTitle, sFileName, sCommand, true);
            }
        }
    );
}

function getHLSBatchText(sStreamUrl)
{
    return "@echo off \r\nstart \"Radio FM\" \"C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe\"  \"" + sStreamUrl + "\"";
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
    else if (sUrl.indexOf("facebook.com") > 0)
    {
        giSite = SITE_FACEBOOK;
    }
    else if (sUrl.indexOf("xvideos.com") > 0)
    {
        giSite = SITE_XVIDEO;
    }
    else if (sUrl.indexOf("a9av.com") > 0)
    {
        giSite = SITE_A9AV;
    }
    else if (sUrl.indexOf("107.170.52.154") > 0)
    {
        giSite = SITE_JKF;
    }
    else if (sUrl.indexOf("85st.com/") > 0)
    {
        giSite = SITE_85ST;
    }
    else if (sUrl.indexOf("hichannel.hinet.net") > 0)
    {
        giSite = SITE_HICHANNEL;
    }
    else if (sUrl.indexOf("streamin.to/") > 0)
    {
        giSite = SITE_STREAMINTO;
    }
    else
    {
        giSite = SITE_OTHER;
    }
    
    log("SetSite:" + giSite + " [" + sUrl + "]");
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
            asFileName[i] = asTitle[i].trim();
        }
    }
    
    log("getAllFileName:" + asFileName);
    
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

function existFlashxTV()
{
    var eBody = document.getElementsByTagName("body")[0];
    
    return eBody.innerHTML.indexOf("src=\"http://www.flashx.tv/") > 0;
}

function existStreaminTo()
{
    var eBody = document.getElementsByTagName("body")[0];
    var sHtml = eBody.innerHTML;
    var iBegin = sHtml.indexOf("http://streamin.to/");
    var iEnd1 = sHtml.indexOf("\"", iBegin);
    var iEnd2 = sHtml.indexOf("\'", iBegin);
    var iEnd = iEnd1 < iEnd2 ? iEnd1 : iEnd2;

    if (iBegin > 0 && iEnd > iBegin)
    {
        return sHtml.substring(iBegin, iEnd);
    }
    
    return null;
}

function addElementChild(eMother, eChild, bSameLine)
{
    if (!bSameLine)
    {
        eMother.appendChild(document.createElement("hr"));
    }
    else if (eMother.innerHTML.indexOf("　　") < 0)
    {
        eMother.innerHTML += "　　"
    }
    
    eMother.appendChild(eChild);
    
    if (!bSameLine)
    {
        eMother.appendChild(document.createElement("hr"));
    }
}

function addExternLinkButton()
{
    
    var eTitle = document.getElementsByTagName("h1")[0];
    
    if (eTitle)
    {
        var sTitle = getAllTitle()[0];
        /*
        var eDiv = document.createElement("b");
        eDiv.innerHTML = "規格化標題 : " + sTitle;
        addElementChild(eTitle, eDiv);
        */
        
        eTitle.addEventListener("click", function() {
            //var asTitle = getAllTitle();
            sendCopyText(sTitle, 0);
        }, false);
    }
    
    var sStreaminToUrl = existStreaminTo();
    
    if (giSite == SITE_STREAMINTO)
    {
        var eBody = document.getElementsByTagName("body")[0];
        var sHtml = eBody.innerHTML;
        var sUrl = window.location.href;
        var sFileName = getRegularFileName(getAllTitle()[0]);
        var sCommand = getStreamIoBatchText(sHtml, sUrl, sFileName);
        
        log("Parse streamin.to : " + sFileName);
        
        var sTitle = "▣ 串流影片批次檔 (以外部程式下載) ▣";
        var eTitle = document.getElementsByTagName("h2")[0];
        if (sCommand == RESPONSE_FILE_DELETED)
        {
            addTextMessage(eTitle, "▣ 影片已被刪除 ▣");
        }
        else if (sCommand != RESPONSE_NEED_CLICK_BUTTON)
        {
            addBatchFileButton(eTitle, sTitle, sFileName, sCommand);
        }
    }
    else if (sStreaminToUrl)
    {
        console.log("Streamin.to URL: " + sStreaminToUrl);
        
        sendHttpRequest(sStreaminToUrl, parseStreaminTo);
    }
    
    if (!existFlashxTV())
    {
        console.log("Not Exist Flashx");
        return;
    }
  
    var eBody = document.getElementsByTagName("body")[0];
    var sHtml = eBody.innerHTML;
    
    var sTag = "src=\"http://www.flashx.tv/";
    var iBegin = sHtml.indexOf(sTag) + sTag.length;
    var iEnd = sHtml.indexOf(".html", iBegin);
    var sId = sHtml.substring(iBegin, iEnd);
    
    
    if (sId.split("-").length == 3)
    {
        sId = sId.split("-")[1];
    }
    
    console.log("Exist Flashx ID: " + sId);

    var eTitle = document.getElementsByTagName("h1")[0];
    var eDiv = document.createElement("a");
    eDiv.href = "http://www.tubeoffline.com/download.php?host=flashxTV&video=http://www.flashx.tv/" + sId + ".html";
    eDiv.target = "_blank";
    eDiv.innerHTML = "▣ 解析影片(以IE瀏覽器開啟) ▣";// + gasExternID[i];
    eTitle.appendChild(eDiv);
    
    addElementChild(eTitle, eDiv);
}

function getRegularFileName(str)
{
    return str.trim().replace(/ /g, "_").replace(/\W/g, "");
}

function sendHttpRequest(sUrl, onReadyFunction)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = onReadyFunction;
    xhr.open("GET", sUrl, true);
    xhr.send();
    xhr.url = sUrl;
}

function parseStreaminTo()
{
    if (this.readyState == 4)
    {
        var sHtml = this.responseText;
        var sUrl = this.url;
        
        console.log("Get Streamin.to html Done : " + sHtml.length);
        
        var sFileName = getRegularFileName(getAllTitle()[0]);
        var sCommand = getStreamIoBatchText(sHtml, sUrl, sFileName);
        log(sCommand);
        
        var sTitle = "▣ 串流影片批次檔 (以外部程式下載) ▣";
        var eTitle = document.getElementsByTagName("h1")[0];
        
        if (sCommand == RESPONSE_FILE_DELETED)
        {
            addTextMessage(eTitle, "▣ 影片已被刪除 ▣");
        }
        else if (sCommand != RESPONSE_NEED_CLICK_BUTTON)
        {
            addBatchFileButton(eTitle, sTitle, sFileName, sCommand);
        }
    }
}

function getStreamIoBatchText(sHtml, sUrl, sFileName)
{
    var asTemp = [];
    var sTemp = "";
    var asToken = sHtml.split(/\s*"\s*,*/g);
    var sToken = "";
    var sExtension = ".mp4";
    
    var r, a, f, w, p, y, o;
    
    f = "WIN 19,0,0,207";
    p = sUrl;
    o = sFileName;
    
    for (var i = 0; i < asToken.length; i++)
    {
        sToken = asToken[i];
        //log(i + ": [" + asToken[i] + "]");
        
        if (sToken.indexOf("streamer:") >= 0)
        {
            asTemp = asToken[i + 1].split("vod?h=");
            r = asTemp[0] + "vod";
            a = "vod?h=" + asTemp[1]; 
        }
        else if (sToken.indexOf(" src:") >= 0)
        {
            w = asToken[i + 1];
        }
        else if (sToken.indexOf(" file:") >= 0)
        {
            sTemp = asToken[i + 1];
            if (sTemp.indexOf(".flv?") > 0)
            {
                y = "flv:" + sTemp;
                sExtension = ".flv";
            }
            else
            {
                y = "mp4:" + sTemp;
            }
        }
    }
    
    if (!a || !w || !y)
    {
        if (sHtml.indexOf("id=\"btn_download\"") > 0)
        {
            return RESPONSE_NEED_CLICK_BUTTON;
        }
        return RESPONSE_FILE_DELETED;
    }
    
    var sDownCommand = "rtmpdump -r \"" + r + "\" -a \"" + a + "\" -f \"" + f + "\" -W \"" + w + "\" -p \"" + p + "\" -y \"" + y + "\" -o \"" + o + sExtension + "\"";
    
    var sBatch = 
        "chcp 65001\r\n" + 
        "IF EXIST rtmpdump.exe (\r\n" + 
        "   " + sDownCommand + "\r\n" + 
        ") ELSE (\r\n" + 
        "   echo \"資料夾內找不到rtmpdump.exe，請先下載RTMP下載工具(https://raw.githubusercontent.com/abc9070410/OVParser/master/tools/rtmpdump.exe)，而後放在瀏覽器預設下載資料夾，再執行此bat檔\" > NoRtmpDownloadTool.txt\r\n" +
        "   start \"NoRtmpDownloadTool Message\" notepad NoRtmpDownloadTool.txt\r\n" +
        ")\r\n";
        
    return sBatch;
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
        
        var eDiv = document.createElement("hr");
        aeTitle[i].appendChild(eDiv);

        eDiv = document.createElement("a");
        eDiv.href = asPicUrl[i];
        eDiv.download = sFileName;
        eDiv.innerHTML = "▣ 下載封面(按右鍵另存新檔) ▣";
        //eDiv.innerHTML = "<a download='" + sFileName + "' href='" + asPicUrl[i] + "' >>>&nbsp;下載封面&nbsp;<<</a>";
        eDiv.iVideoIndex = i;
        eDiv.addEventListener('touchstart', clickVideo, false);
        eDiv.addEventListener('click', clickVideo, false);
        aeTitle[i].appendChild(eDiv);
        
        eDiv = document.createElement("b");
        eDiv.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
        aeTitle[i].appendChild(eDiv);
        
        if (gasExternID[i])
        {
            eDiv = document.createElement("a");
            eDiv.href = "http://www.tubeoffline.com/download.php?host=flashxTV&video=http://www.flashx.tv/" + gasExternID[i] + ".html";
            eDiv.target = "_blank";
            //eDiv.download = sFileName;
            eDiv.innerHTML = "▣ 解析影片(以IE瀏覽器開啟) ▣";// + gasExternID[i];
            eDiv.iVideoIndex = i;
            //eDiv.addEventListener('touchstart', clickVideo, false);
            //eDiv.addEventListener('click', clickVideo, false);
            aeTitle[i].appendChild(eDiv);
        }
        
        
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
    var sUrl = window.location.href;
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
        var eTitle = document.getElementById("mname");
        
        if (eTitle)
        {
            asTitle[0] = eTitle.innerHTML.trim();
            
            // copy text for the cover only
            sendCopyText(asTitle[0], 0);
        }
        else 
        {
            eTitle = document.getElementsByTagName("title")[0];
            asTitle[0] = eTitle.innerHTML.split(" - ")[0].replace("Watch Online", "").trim();
        }
    }
    else if (giSite == SITE_A9AV)
    {
        var eTitle = document.getElementById("thread_subject");
        if (eTitle)
        {
            asTitle[0] = eTitle.innerHTML.trim();
            
            // copy text for the cover only
            sendCopyText(asTitle[0], 0);
        }
        /*
        else 
        {
            eTitle = document.getElementsByTagName("title")[0];
            asTitle[0] = eTitle.innerHTML.split(" - ")[0].trim();
        }
        */
    }
    else if (giSite == SITE_JKF)
    {
        var ePosts = document.getElementsByClassName("t_fsz");
        if (ePosts && ePosts.length > 0)
        {
            var eTitle = document.getElementsByTagName("title")[0];
            asTitle[0] = eTitle.innerHTML.split(" - ")[0].trim();
            sendCopyText(asTitle[0], 0);
        }
    }
    else if (giSite == SITE_BILIBILI)
    {
        var eTitle = document.getElementsByTagName("title")[0];
        asTitle[0] = eTitle.innerHTML.split("_")[0].trim();
        
        if (sUrl.indexOf("/video/") > 0)
        {
            sendCopyText(asTitle[0], 0);
        }
    }
    else if (giSite == SITE_FACEBOOK)
    {
        var eTitle = document.getElementById("pageTitle");
        if (eTitle)
        {
            asTitle[0] = eTitle.innerHTML.trim();
        }
    }
    else
    {
        var sSplitToken = " - ";
        var aeTitle = document.getElementsByTagName("title");
        var asTemp = aeTitle[0].innerHTML.split(sSplitToken);
        var i;

        for (i = 0; i < asTemp.length - 1; i ++)
        {
            if (i == 0)
            {
                asTitle[0] = "";
            }
            else
            {
                asTitle[0] += " - ";
            }

            asTitle[0] += asTemp[i].trim();
        }
        
        if (asTitle.length == 0)
        {
            asTitle[0] = aeTitle[0].innerHTML.trim(); // final choice
        }
        
        asTitle[0] = asTitle[0].replace(/-\w\w成人影片|-85街論壇|-85st免費a片線上看/g, "");
        
        var eBody = document.getElementsByTagName("body")[0];
        var sHTML = eBody.innerHTML;
        
        var iEnd = sHTML.indexOf("pl.jpg");
        if (iEnd > 0)
        {
            var iBegin = sHTML.lastIndexOf(">", iEnd) + 1;
            var sTemp = sHTML.substring(iBegin, iEnd).trim().toUpperCase();
            
            asTemp = sTemp.split(/[a-zA-Z]+/g);
            var sNum = asTemp[asTemp.length - 1];
            
            asTemp = sTemp.split(/\d+/g);
            var sCompany = asTemp[asTemp.length - 2];
            
            var sVideoNo = sCompany + "-" + sNum;
            
            var sOldTitle = asTitle[0];
            if (sCompany && sCompany.length > 3 &&
                sNum && sNum.length > 2)
            {
                sOldTitle = sOldTitle.replace(sCompany, "").replace(sNum, "");
                sOldTitle = sOldTitle.replace("[]", "").trim();
            }
            
            /*
            for (i = 0; i < sTemp.length; i++)
            {
                if (!isNaN(sTemp.substring(i, i + 1)))
                {
                    break;
                }
            }
            
            var sVideoNo = sTemp.substring(0, i) + "-" + sTemp.substring(i, sTemp.length);
            */
            asTitle[0] = sVideoNo + " " + sOldTitle;
        }
    }
    
    log("getAllTitle:" + asTitle);
    
    return asTitle;
}

function getAllPicUrl()
{
    var sUrl = window.location.href;
    var asPic = [];
    
    if (giSite == SITE_TWDVD)
    {
        var aePic = document.getElementsByClassName("blog_body");
        
        for ( var i = 0; i < aePic.length; i ++ )
        {
            var sHTML = aePic[i].innerHTML;

            var sTag = "http://www.flashx.tv/embed-";
            
            var iBegin = sHTML.indexOf(sTag) + sTag.length;
            var iEnd = sHTML.indexOf("-640x360", iBegin);
            if (iBegin > sTag.length && iEnd > iBegin)
            {
                gasExternID[i] = sHTML.substring(iBegin, iEnd);
            }
            else
            {
                gasExternID[i] = null;
            }
            
            iBegin = sHTML.indexOf("image=") + 6;
            iEnd = sHTML.indexOf("\"", iBegin);
            asPic[i] = sHTML.substring(iBegin, iEnd);
            
            //console.log("-->" + sHTML.substring(0, iBegin));
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
        var asTemp = sUrl.split("/video/");
        
        var sTag = null;
        if (asTemp.length == 2)
        {
            sTag = asTemp[1].split("/")[0];
            asPic[0] = "http://images.thisav.com/images/videothumbs/" + sTag + "-1.jpg";
        }
    }
    else if (giSite == SITE_XVIDEO)
    {
        var eDiv = document.getElementById("player");
        
        if (eDiv)
        {
            var sHtml = eDiv.innerHTML;
            var iBegin = sHtml.indexOf("thumbslll");
            var iEnd = sHtml.indexOf("&amp;", iBegin);
            iBegin = sHtml.lastIndexOf("http:", iEnd);
            
            asPic[0] = sHtml.substring(iBegin, iEnd);
        }
        
    }
    else
    {
        var aeDiv = document.getElementsByTagName("meta");
        
        for (var i = 0; i < aeDiv.length; i++)
        {
            if (aeDiv[i].name && aeDiv[i].content && aeDiv[i].name.indexOf("image") > 0)
            {
                asPic[0] = aeDiv[i].content; // ex. vimeo
            }
        }
    }

    log(" Cover:" + asPic);
    
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
    
    log("COPY TEXT:" + sText);
}

function addBatchFileButton(eTitle, sTitle, sFileName, sText, bSameLine)
{
    var blob = new Blob([sText], {type: "text/plain;charset=utf-8"});
    var sUrl = URL.createObjectURL(blob);

    var eDiv = document.createElement("a");
    eDiv.id = "BATCH_FILE_ID";
    eDiv.href = sUrl;
    eDiv.download = sFileName + ".bat";
    eDiv.target = "_blank";
    eDiv.innerHTML = sTitle;

    addElementChild(eTitle, eDiv, bSameLine);
}

function addTextMessage(eTitle, sText, bSameLine)
{
    var eDiv = document.createElement("p");
    eDiv.innerHTML = sText;
    addElementChild(eTitle, eDiv, bSameLine);
}


function log(sText)
{
    console.log("[OVP]" + sText);
}

/*

chcp 65001
IF EXIST rtmpdump.exe (
    echo exists
) ELSE (
    echo "資料夾內找不到rtmpdump.exe，請先下載RTMP下載工具(https://raw.githubusercontent.com/abc9070410/OVParser/master/tools/rtmpdump.exe)，而後放在瀏覽器預設下載資料夾" > NoRtmpDownloadTool.txt
    start "NoRtmpDownloadTool Message" notepad NoRtmpDownloadTool.txt
)


*/