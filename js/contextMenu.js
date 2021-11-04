
const contextMenuItem = {
    "id": "addEmote",
    "title": "add emote to chrome extension",
    "contexts": ["image", "link"]
}
const contextMenuItemTwitch = {
    "id": "addEmoteTwitch",
    "title": "add emote to chrome extension",
    "contexts": ["page"],
    "documentUrlPatterns": ["*://*.twitch.tv/*"]
}
const sites = ["frankerfacez", "betterttv"];
//keys
const BTTVKey = "bttvEmotes";
const FFZKey = "ffzEmotes";
const TwitchKey = "twitchEmotes";

//vars
let latestTwitch = {alt: null, id:null};

chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.create(contextMenuItemTwitch);

chrome.contextMenus.onClicked.addListener((data)=>{
    if(data.menuItemId == contextMenuItem.id && data.pageUrl.includes("twitch.tv")){return;}
    if(data.menuItemId == contextMenuItem.id && (data.hasOwnProperty("srcUrl") || data.hasOwnProperty("linkUrl") )){ 
        let len = sites.length;
        for(let i=0; i< len;i++){
            if( (data.hasOwnProperty("srcUrl") && data.srcUrl.includes(sites[i]) )
            || (data.hasOwnProperty("linkUrl") && data.linkUrl.includes(sites[i]) ) ){
                let key = i==0 ?FFZKey : BTTVKey;
                
                let emoteID = null;
                let emoteName = null;
                let sections = data.hasOwnProperty("srcUrl") ? data.srcUrl.split("/") : data.linkUrl.split("/");
                if(i==0){
                    //FFZ
                    if(data.hasOwnProperty("linkUrl") && !data.linkUrl.includes("cdn."+sites[i])){
                        sections = data.linkUrl.split("/");
                        let emoteIDName = sections[sections.indexOf("emoticon")+1].split("-");
                        emoteID = emoteIDName[0];
                        emoteName = emoteIDName[1];
                    }else{
                        emoteID = sections[sections.indexOf("emoticon")+1];
                    }
                }else{
                    //BTTV
                    emoteID = data.hasOwnProperty("srcUrl") ? sections[sections.indexOf("emote")+1] : sections[sections.indexOf("emotes")+1];
                }
                if(emoteID != null){
                    if(emoteName != null){
                        SetStorage(key, emoteName, emoteID);
                    }else{
                        //get emote name from id
                        let fetch = i==0 ? "https://api.frankerfacez.com/v1/emote/" : "https://api.betterttv.net/3/emotes/";
                        fetch += emoteID;
                        httpGetAsync(fetch, (response)=>{
                            response = JSON.parse(response);
                            if(response.hasOwnProperty("emote") && response.emote.hasOwnProperty("name")){
                                emoteName = response.emote.name;
                            }else if(response.hasOwnProperty("code")){
                                emoteName = response.code;
                            }
                            if(emoteName != null){
                                SetStorage(key, emoteName, emoteID);
                            }
                        })
                    }
                }
                break;
            }
        }
    }else if(data.menuItemId == contextMenuItemTwitch.id && latestTwitch.alt != null && latestTwitch.id != null){
        console.log(latestTwitch.alt + " " + latestTwitch.id)
        SetStorage(TwitchKey, latestTwitch.alt, latestTwitch.id);
    }
})


//events
chrome.runtime.onMessage.addListener((request, sender) => {
      if (request.hasOwnProperty("alt") && request.hasOwnProperty("id")){
        //gets name from user right clicking a twitch emote
        latestTwitch.alt = request.alt;
        latestTwitch.id = request.id;
      } 
});


//storage functions
function SetStorage(key, name, id){
    //check emote doesnt already exist
    GetStorage(key, (res)=>{
        if(!res.hasOwnProperty(key)){res[key] = {}}
        let emotes = res[key];
        if(Object.keys(emotes).indexOf(name) < 0){
            emotes[name] = id;
            chrome.storage.sync.set({
                [key]: emotes
            })
        }
        console.log(res)
    })
}
function GetStorage(key, callback){
    chrome.storage.sync.get(key, callback)
}
function clearEmoteStorage(){chrome.storage.sync.set({[BTTVKey]: {},[FFZKey]: {}})}
//clearEmoteStorage();

function httpGetAsync(URL, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", URL, true); // true for asynchronous 
    xmlHttp.send(null);
}