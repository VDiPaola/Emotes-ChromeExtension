//elements
const tags = ["p","h1","h2","h3","h4","em","span", "yt-formatted-string"]
let bttvImage = "<img src='https://cdn.betterttv.net/emote/EMOTEID/1x' />";
let ffzImage = "<img src='https://cdn.frankerfacez.com/emoticon/EMOTEID/1' />";
let twitchImage = "<img src='https://static-cdn.jtvnw.net/emoticons/v1/EMOTEID/1.0' />";


//keys
const blacklist_key = "blacklistMode";
const BTTVKey = "bttvEmotes";
const FFZKey = "ffzEmotes";
const TwitchKey = "twitchEmotes";
const fullEmoteMode_Key = "fullEmoteMode";

//vars
let bttvEmoteNames = [];
let ffzEmoteNames = [];
let twitchEmoteNames = [];
let bttv = {};
let ffz = {};
let twitch = {};
let blacklist = [];
let nodeLists = [];
let blacklistMode = true;
let fullEmoteMode = true;

//entry point
function init(){
    //check if site is blacklisted
    GetStorage(blacklist_key, (res)=>{
        let key = "blacklist";
        if(res[blacklist_key] == false){
            blacklistMode = false;
            key = "whitelist"
        }
        //get lists
        GetStorage(key, (res)=>{
            if(res.hasOwnProperty(key)){
                if(res[key].indexOf(window.location.hostname) >= 0){ 
                    if(blacklistMode){
                        //site blacklisted
                        return;
                    }else{
                        //site whitelisted
                        loadEmotes();
                    }
                }else{
                    if(blacklistMode){
                        //not blacklisted
                        loadEmotes();
                    }else{
                        //not whitelisted
                        return;
                    }
                }
            }
        })
    })
}
init();

function loadEmotes(){
    //load initial emote sets
    GetStorage(BTTVKey, (res)=>{
        if(res.hasOwnProperty(BTTVKey)){
            let obj = res[BTTVKey]
            bttvEmoteNames = Object.keys(obj);
            bttv = obj;
        }
        GetStorage(FFZKey, (res)=>{
            if(res.hasOwnProperty(FFZKey)){
                let obj = res[FFZKey]
                ffzEmoteNames = Object.keys(obj);
                ffz = obj;
            }
            GetStorage(TwitchKey, (res)=>{
                if(res.hasOwnProperty(TwitchKey)){
                    let obj = res[TwitchKey]
                    twitchEmoteNames = Object.keys(obj);
                    twitch = obj
                }
                //get fullEmoteMode
                GetStorage(fullEmoteMode_Key, (res)=>{
                    fullEmoteMode = false;
                    if(res[fullEmoteMode_Key] === true){
                        fullEmoteMode = true;
                    }
                    //start replacing elements and observe
                    replaceStart();
                })
            })
        })
    })
}


//blacklist update
/*
chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
          var storageChange = changes[key];
          console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        }
      });
*/

function replaceElement(element, emoteName, image){
    if(fullEmoteMode){
        element.innerHTML = element.innerHTML.replace(new RegExp(`\\b${escapeRegExp(emoteName)}\\b`, "g"), image);
    }else{
        element.innerHTML = element.innerHTML.replace(emoteName, image);
    }
}

function loopReplace(nodeLists, callback = null){
    nodeLists.forEach((elements)=>{
        elements.forEach((element)=>{
            bttvEmoteNames.forEach(emote => {
                let regex = new RegExp(`\\b${escapeRegExp(emote)}\\b`, "g");
                if(
                    (!fullEmoteMode && element.innerText.includes(emote))
                    || (fullEmoteMode && regex.test(element.innerText))
                ){
                    let image = bttvImage.replace("EMOTEID", bttv[emote])
                    replaceElement(element, emote, image);
                }
            });
            ffzEmoteNames.forEach(emote => {
                let regex = new RegExp(`\\b${escapeRegExp(emote)}\\b`, "g");
                if(
                    (!fullEmoteMode && element.innerText.includes(emote))
                    || (fullEmoteMode && regex.test(element.innerText))
                ){
                    let image = ffzImage.replace("EMOTEID", ffz[emote])
                    replaceElement(element, emote, image);
                }
            });
            twitchEmoteNames.forEach(emote => {
                let regex = new RegExp(`\\b${escapeRegExp(emote)}\\b`, "g");
                if(
                    (!fullEmoteMode && element.innerText.includes(emote))
                    || (fullEmoteMode && regex.test(element.innerText))
                ){
                    let image = twitchImage.replace("EMOTEID", twitch[emote])
                    replaceElement(element, emote, image);
                }
            });
            
        })
    })
    if(callback != null){callback()}
}

function replaceStart(){
    tags.forEach((tag)=>{
        nodeLists = nodeLists.concat(document.querySelectorAll(tag));
    })
    
    loopReplace(nodeLists, function(){
        // Start observing the target node for configured mutations
        //check if they have observing on or not
        observer.observe(targetNode, config);
    });

    
}


// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree:true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    let newNodeLists = [];
    for(let mutation of mutationsList) {
        if(mutation.addedNodes.length <= 0 || (mutation.addedNodes.length > 0 && mutation.addedNodes[0].innerText == undefined)){continue;}
        tags.forEach((tag)=>{
            newNodeLists = newNodeLists.concat(mutation.addedNodes[0].querySelectorAll(tag));
        })
    }
    loopReplace(newNodeLists);
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);



//storage
function GetStorage(key, callback){
    chrome.storage.sync.get(key, callback)
}


//events
//stop observer before unload
window.addEventListener("beforeunload", function (event) {
    observer.disconnect();
});
//
document.addEventListener("mousedown", (event)=>{
    let element = event.target
    //if site is on twitch and element is an img/button and element has alt attribute and right clicked then send alt tag to contextMenu;
    if(window.location.hostname.includes("twitch.tv") && event.button === 2){
        if(element.tagName == "IMG" && element.hasAttribute("alt") && element.hasAttribute("src")){
            let src = element.getAttribute("src");
            let sections = src.split("/");
            if(src.includes("static-cdn.jtvnw") && src.includes("emoticons")){
                let id = sections[sections.indexOf("emoticons")+2]
                chrome.runtime.sendMessage({alt: element.getAttribute("alt"), id:id});
                return;
            }
        }else if(element.tagName == "BUTTON"){
            let img = element.querySelector("img");
            if(img && img.hasAttribute("alt") && img.hasAttribute("src")){
                let src = img.getAttribute("src");
                let sections = src.split("/");
                if( (src.includes("static-cdn.jtvnw") && src.includes("emoticons"))
                || (src.includes("cdn.frankerfacez") && src.includes("replacements"))
                ){
                    let id = null;
                    if(src.includes("static-cdn.jtvnw")){
                        id = sections[sections.indexOf("emoticons")+2]
                    }else{
                        id = sections[sections.length-1].split("-")[0]
                    }
                    chrome.runtime.sendMessage({alt: img.getAttribute("alt"), id:id});
                    return;
                }
            }
        }//cdn.frankerfacez.com/script/replacements/33-DansGame.png"
        chrome.runtime.sendMessage({alt: null, id:null});
    }
})




//helpers
function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }