import { resolveEmote, urlToId, UrlToType } from "../shared/Helpers";
import { GlobalSetting } from "../shared/Settings";

chrome.runtime.onInstalled.addListener( () => {
    chrome.contextMenus.create({
      id: 'addEmote',
      title: "Emotes Everywhere", 
      contexts:[ "image" ],
      documentUrlPatterns: ["*://betterttv.com/*","*://frankerfacez.com/*","*://7tv.app/*","*://twitch.tv/*"]
    });
  
    chrome.contextMenus.create({
      parentId: 'addEmote',
      id: "addEmoteTwitch",
      title: "add emote to chrome extension", 
      contexts:["image"]
    });
  
  });
  
  chrome.contextMenus.onClicked.addListener( async ( info, tab ) => {
    if (info.parentMenuItemId == "addEmote") {
          if(info.menuItemId == "addEmoteTwitch"){
              //chrome.tabs.sendMessage(tab.id, {type:"emoteGrabber"}, {frameId: info.frameId});
                let url = info.srcUrl;
                let type = UrlToType(url);
                let id = urlToId(url, type);
                let emote = await resolveEmote(id, type, url);
                console.log(emote)
                console.log(id)
                console.log(type)
                if (emote){
                    //try to add emote
                    GlobalSetting.EMOTES.Get().then(emotes=>{
                        if (emotes.filter(e => e.name == emote.name).length <= 0) {
                            emotes.push(emote)
                            GlobalSetting.EMOTES.Set(emotes)
                        }else{
                            console.error("Emotes Everywhere: emote with that name exists")
                        }
                    })
                }
                
          }
    }
  });
