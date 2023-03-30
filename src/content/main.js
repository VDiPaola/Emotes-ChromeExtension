import { GlobalSetting } from "../shared/Settings";
import { getCDN } from "../shared/Helpers";
import { onCustomElementObserved, escapeRegExp } from "./helpers";

(async ()=>{
//get settings
GlobalSetting.IS_WHITELIST.Get().then(async isWhitelist => {
    //check if enabled on this page
    let enabled = true;
    if (isWhitelist){
        const whitelist = await GlobalSetting.WHITELIST.Get()
        if (!whitelist.includes(window.location.hostname)){
            enabled = false;
        }
        
    }else{
        const blacklist = await GlobalSetting.BLACKLIST.Get()
        if (blacklist.includes(window.location.hostname)){
            enabled = false;
        }
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
                mutations = mutations.filter(mut => mut.addedNodes.length > 0)
                let nodes = mutations.map(m => Array.from(m.addedNodes)).flat(1);
                nodes = nodes.filter(node => node?.innerText || node?.wholeText)
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


})()
