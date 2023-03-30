import { GlobalSetting } from "../shared/Settings";
import { getCDN } from "../shared/Helpers";
import { onCustomElementObserved, escapeRegExp } from "./helpers";


window.addEventListener("load", async () => {
//get settings
GlobalSetting.IS_WHITELIST.Get().then(isWhitelist => {
    //check if enabled on this page
    let enabled = true;
    if (isWhitelist){
        GlobalSetting.WHITELIST.Get().then(whitelist => {
            if (!whitelist.includes(window.location.hostname)){
                enabled = false;
            }
        })
    }else{
        GlobalSetting.BLACKLIST.Get().then(blacklist => {
            if (blacklist.includes(window.location.hostname)){
                enabled = false;
            }
        })
    }

    if (!enabled) return;
    GlobalSetting.EMOTE_FULL_NAME.Get().then(emoteFullName => {
        GlobalSetting.EMOTES.Get().then(emotes => {
            console.log(emotes)
            let emoteNames = emotes.map(e => e.name);

            function replaceElement(element, emoteName, image){
                if (element?.wholeText){
                    element = element.parentNode
                }
                console.log(element)
                if (element?.innerText && element.innerText.includes(emoteName)){
                    if(emoteFullName){
                        element.innerHTML = element.innerHTML.replaceAll(new RegExp(`\\b${escapeRegExp(emoteName)}\\b`, "g"), image);
                    }else{
                        element.innerHTML = element.innerHTML.replaceAll(emoteName, image);
                    }
                }
                
            }

            //page elements before observing
            for (let emote of emotes){
                replaceElement(document.querySelector("body"), emote.name, `<img src='${getCDN(emote)}' />`)
            }

            //observe
            onCustomElementObserved(document.body, (mutations) =>{
                let nodes = mutations.map(m => Array.from(m.addedNodes)).flat(1);
                console.log(mutations)
                for(let node of nodes){
                    for (let emote of emotes){
                        replaceElement(node, emote.name, `<img src='${getCDN(emote)}' />`)
                    }
                    
                }
            })

        })
    })
})
})




