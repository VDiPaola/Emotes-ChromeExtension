//options:
//get all emotes from a channel (bttv/ffz)
//disable/enable mutation observer for performance

import { getCDN } from "../shared/Helpers";
import { GlobalSetting } from "../shared/Settings";

//advanced:
//set specific tags that are queried
//add custom emote thats not on bttv/ffz
//mutation observer manager - set exact websites that it runs on

//popup:
//enable/disable entire extension

//todo:
//make more efficient on certain websites like twitter and reddit
//add twitch emotes
//preload predefined set of most popular emotes
//make options mobile friendly

//elements
const blacklistMode = document.getElementById('blacklistMode');
const contentItem = document.getElementById('contentItem');
const content = document.getElementById("content");
const emoteCheckbox = document.getElementById("emoteCheckbox");

GlobalSetting.IS_WHITELIST.Get().then(isWhitelist => {
    blacklistMode.selectedIndex = isWhitelist ? 1 : 0;
})

GlobalSetting.EMOTE_FULL_NAME.Get().then(isEmoteFullName => {
    emoteCheckbox.checked = isEmoteFullName
})


//event listeners
blacklistMode.addEventListener("change", (e)=>{
    GlobalSetting.IS_WHITELIST.Set(e.target.value.toLowerCase() == 'whitelist')
})
contentItem.addEventListener("change", onContentItemChange)
emoteCheckbox.addEventListener("change", (e)=>{
    GlobalSetting.EMOTE_FULL_NAME.Set(e.target.checked)
});

function onContentItemChange(event){
    let value = event.target.value;
    content.innerHTML = "";
    switch(value.toLowerCase()){
        case '7tvframe':
            content.innerHTML = "<iframe src='https://7tv.app/emotes?page=1' />"
            break;
        case 'blacklist':
            GlobalSetting.BLACKLIST.Get().then(blacklist => {
                createLists(blacklist, content, false)
            })
            break;
        case 'whitelist':
            GlobalSetting.WHITELIST.Get().then(whitelist => {
                createLists(whitelist, content, true)
            })
            break;
        case 'emotes':
            loadEmotes();
            break;
        default:
            content.innerHTML = "not available";
            break
    }
}
function removeEmote(event){
    let element = event.target
    let emoteName = element.getAttribute("emoteName");
    
    GlobalSetting.EMOTES.Get().then(emotes => {
        emotes = emotes.filter(emote => emote.name != emoteName)
        GlobalSetting.EMOTES.Set(emotes);
    })

    event.target.parentNode.remove()
}


// //helper functions
function createLists(list, element, isWhitelist){
    let ul = document.createElement('ul')
    ul.className = 'list';
    list.forEach(url => {
        let li = document.createElement('li');
        let span = document.createElement('span');
        let textnode = document.createTextNode(url);
        span.value = url;
        span.appendChild(textnode);
        textnode = document.createElement('button');
        textnode.className = "removeButton";
        let dash = document.createTextNode('Remove');
        textnode.appendChild(dash);
        span.appendChild(textnode);
        li.appendChild(span);
        ul.appendChild(li);
    });
    element.appendChild(ul);

    let buttons = document.getElementsByClassName("removeButton");
    let len = buttons.length;
    for(let i=0;i<len;i++){
        buttons[i].addEventListener("click",function(event){
            let site = event.target.parentNode.value
            //remove from storage
            removeSite(site, isWhitelist);
            //remove from table
            event.target.parentNode.parentNode.remove();
        })
    }
}
function removeSite(site, isWhitelist){
    if(isWhitelist){
        GlobalSetting.WHITELIST.Get().then(whitelist => {
            var index = whitelist.indexOf(site);
            if (index !== -1) {
                whitelist.splice(index, 1);
                GlobalSetting.WHITELIST.Set(whitelist);
            }
        })
    }else{
        GlobalSetting.BLACKLIST.Get().then(blacklist => {
            var index = blacklist.indexOf(site);
            if (index !== -1) {
                blacklist.splice(index, 1);
                GlobalSetting.BLACKLIST.Set(blacklist);
            }
        })
    }
}


function loadEmotes(){
    GlobalSetting.EMOTES.Get().then(emotes => {
        for(let emote of emotes){
            let url = getCDN(emote);
            let image = document.createElement("img");
            image.src = url;
            image.setAttribute("emoteName", emote.name);
            let newDiv = document.createElement('div')
            newDiv.title = emote.name;
            newDiv.className = "emotesContainer";
            newDiv.appendChild(image);
            content.appendChild(newDiv);

            image.addEventListener("click", removeEmote)
        }
    })
}
