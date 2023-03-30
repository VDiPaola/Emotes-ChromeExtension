
//elements
// const siteListCheck = document.getElementById("siteListCheck"); const siteListCheckGreen = "rgba(62, 207, 18, 0.849)"; const siteListCheckRed = "rgba(114, 18, 1, 0.849)";
// const powerButton = document.getElementById("power");
// const siteToggle = document.getElementById("siteToggle");

// //vars
// let blacklistMode = true;
// let siteList = []; //blacklist / whitelist
// let currentHost = "";

// //keys
// const blacklist_key = "blacklistMode";
// const BTTVKey = "bttvEmotes";
// const FFZKey = "ffzEmotes";
// const TwitchKey = "twitchEmotes";
// const fullEmoteMode_Key = "fullEmoteMode";

// //entry point
// function init(){
//     //check if blacklist mode or whitelist mode is on
//     GetStorage(blacklist_key, (res)=>{
//         //set key
//         let key = "blacklist";
//         if(res[blacklist_key] == false){
//             blacklistMode = false;
//             key = "whitelist"
//         }
//         //set text
//         siteToggle.textContent = key[0].toUpperCase() + key.slice(1);
//         //update local list
//         GetStorage(key, (res)=>{
//             siteList = res.hasOwnProperty(key) ? res[key] : [];
//             //check if site is whitelisted/blacklisted
//             chrome.tabs.query({active: true, currentWindow: true}, tabs => {
//                 let url = tabs[0].url;
//                 let hostname = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
//                 if(siteList.includes(hostname)){
//                     if(!blacklistMode){
//                         siteListCheck.style.backgroundColor = siteListCheckGreen;
//                     }
//                 }else{
//                     if(blacklistMode){
//                         siteListCheck.style.backgroundColor = siteListCheckGreen;
//                     }
//                 }
//             });
//         })
//     })
// }
// init();

// //events
// powerButton.addEventListener("click", onPowerToggle);
// siteToggle.addEventListener("click", onSiteToggle);


// //event handlers
// function onPowerToggle(event){
//     GetStorage(["blacklist", "whitelist"],function(res){
//         console.log(res)
//     })
// }
// function onSiteToggle(event){
//     //get current hostname
//     chrome.tabs.query({active: true, currentWindow: true}, tabs => {
//         let url = tabs[0].url;
//         let hostname = url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
//         AddToSiteList(hostname);
//     });
// }



// //storage functions
// function AddToSiteList(site){
//     if(siteList.indexOf(site) == -1){
//         let key = blacklistMode ? "blacklist" : "whitelist";
//         //add local
//         siteList.push(site);
//         //add storage
//         chrome.storage.sync.set({[key]: siteList})

//         //update indicator colour
//         siteListCheck.style.backgroundColor = blacklistMode ? siteListCheckRed : siteListCheckGreen;
//     }
// }
// //reset blacklist/whitelist
// //chrome.storage.sync.set({blacklist:[],whitelist:[]})
// function GetStorage(key, callback){
//     chrome.storage.sync.get(key, callback)
// }