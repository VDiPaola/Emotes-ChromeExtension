//options:
//get all emotes from a channel (bttv/ffz)
//disable/enable mutation observer for performance

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


//keys
const blacklist_key = "blacklistMode";
const BTTVKey = "bttvEmotes";
const FFZKey = "ffzEmotes";
const TwitchKey = "twitchEmotes";
const fullEmoteMode_Key = "fullEmoteMode";

//event listeners
blacklistMode.addEventListener("change", onBlacklistModeChange)
contentItem.addEventListener("change", onContentItemChange)
emoteCheckbox.addEventListener("change", onEmoteCheckboxChange);

//vars
let blacklist = false;
let bttvImage = "https://cdn.betterttv.net/emote/EMOTEID/1x";
let ffzImage = "https://cdn.frankerfacez.com/emoticon/EMOTEID/1";
let twitchImage = "https://static-cdn.jtvnw.net/emoticons/v1/EMOTEID/1.0";


function init(){
    //get blacklistmode 
    GetStorage(blacklist_key, (res)=>{
        blacklist = false;
        let value = "whitelist"
        if(res[blacklist_key]){
            blacklist = true;
            value = "blacklist"
        }
        document.querySelector('#blacklistMode [value="' + value + '"]').selected = true;
    })
    //get fullEmoteMode
    GetStorage(fullEmoteMode_Key, (res)=>{
        if(res[fullEmoteMode_Key] === true){
            emoteCheckbox.checked = true;
        }
    })
}
init()


//event handlers
function onBlacklistModeChange(event){
    blacklist = false;
    if(event.target.value.toLowerCase() == 'blacklist'){
        blacklist = true;
    }
    chrome.storage.sync.set({[blacklist_key]:blacklist})
}
function onContentItemChange(event){
    let value = event.target.value;
    content.innerHTML = "";
    switch(value.toLowerCase()){
        case 'bttvframe':
            content.innerHTML = "<iframe src='https://betterttv.com/emotes/shared' />"
            break;
        case 'ffzframe':
            content.innerHTML = "<iframe src='https://www.frankerfacez.com/emoticons/wall?q=&sort=count-desc' />"
            break;
        case 'blacklist':
            GetStorage("blacklist", (res)=>{
                createLists(res["blacklist"], content)
            })
            break;
        case 'whitelist':
            GetStorage("whitelist", (res)=>{
                createLists(res["whitelist"], content)
            })
            break;
        case 'bttv':
            loadEmotes(BTTVKey, bttvImage);
            break;
        case 'ffz':
            loadEmotes(FFZKey, ffzImage);
            break;
        case 'twitch':
            loadEmotes(TwitchKey, twitchImage);
            break;
        default:
            content.innerHTML = "not available";
            break
    }
}
function removeEmote(event){
    let element = event.target
    let emoteID = element.getAttribute("emoteID");
    let emoteName = element.getAttribute("emoteName");
    let key = element.getAttribute("emoteKey");
    
    //get emotes
    GetStorage(key, (res)=>{
        let obj = res[key];
        if(obj.hasOwnProperty(emoteName)){
            //delete emote from object
            delete obj[emoteName];
        }
        //set storage
        chrome.storage.sync.set({
            [key]: obj
        })
        //remove emote element
        element.parentNode.remove();
    })
}
function onEmoteCheckboxChange(event){
    console.log(event.target.checked)
    let enabled = event.target.checked;
    chrome.storage.sync.set({
        [fullEmoteMode_Key]:enabled
    })
}

//helper functions
function createLists(list, element){
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
            removeSite(site);
            //remove from table
            event.target.parentNode.parentNode.remove();
        })
    }
}
function removeSite(site){
    //get site list
    let key = contentItem.options[contentItem.selectedIndex].value;
    key = key.toLowerCase();
    if(key == "blacklist" || key == "whitelist"){
        GetStorage(key, (res)=>{
            //check site exists
            if(res[key].indexOf(site) >= 0){
                res[key].splice(res[key].indexOf(site),1);
                //set storage
                chrome.storage.sync.set({[key]:res[key]})
            }
        })
    }
}
function loadEmotes(key, urlFormat){
    GetStorage(key, (res)=>{
        console.log(res)
        let emotes = res[key];
        for(let emote in emotes){
            let url = urlFormat.replace("EMOTEID", emotes[emote])
            let image = document.createElement("img");
            image.src = url;
            image.setAttribute("emoteID", emotes[emote]);
            image.setAttribute("emoteName", emote);
            image.setAttribute("emoteKey", key);
            let newDiv = document.createElement('div')
            newDiv.title = emote;
            newDiv.className = "emotesContainer";
            newDiv.appendChild(image);
            content.appendChild(newDiv);

            image.addEventListener("click", removeEmote)
        }
    })
}



//storage
function GetStorage(key, callback){
    chrome.storage.sync.get(key, callback)
}