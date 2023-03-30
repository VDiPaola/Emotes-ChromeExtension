import { NetworkManager } from "./NetworkManager"

export const TYPES = {
    TWITCH: "TWITCH",
    BETTERTTV: "BETTERTTV",
    FFZ: "FFZ",
    "7TV": "7TV"
}

export const CDNS = {
    [TYPES.TWITCH]: "https://static-cdn.jtvnw.net/emoticons/v2/EMOTE_ID/default/dark/1.0",
    [TYPES.BETTERTTV]: "https://cdn.betterttv.net/emote/EMOTE_ID/1x.webp",
    [TYPES.FFZ]: "https://cdn.frankerfacez.com/emoticon/EMOTE_ID/1",
    [TYPES["7TV"]]: "https://cdn.7tv.app/emote/EMOTE_ID/1x.webp"
}

export function UrlToType(url){
    url = url.toLowerCase()
    for (let type in TYPES){
        
        if (url.includes(type.toLowerCase())){
            return type
        }
    }
    return null
}

export function urlToId(url, type){
    if(type == TYPES["7TV"] || type === TYPES.BETTERTTV){
        //https://cdn.7tv.app/emote/60aea4074b1ea4526d3c97a9/4x.webp
        //https://cdn.betterttv.net/emote/5f1b0186cf6d2144653d2970/3x.webp
        let slice = url.slice(url.indexOf("emote"))
        slice = slice.split("/")
        let id = slice[1]
        return id;
    }else if (type == TYPES.FFZ){
        //https://cdn.frankerfacez.com/emoticon/128054/1
        let slice = url.slice(url.indexOf("emoticon"))
        slice = slice.split("/")
        let id = slice[1]
        return id;
    }else if (type == TYPES.TWITCH){
        //https://static-cdn.jtvnw.net/emoticons/v2/120232/default/dark/1.0
        let slice = url.slice(url.indexOf("emoticon"))
        slice = slice.split("/")
        let id = slice[2]
        return id;
    }
    
}

export async function resolveEmote(id, type, url){
    if(type == TYPES["7TV"]){
        //get emote data
        let res = await NetworkManager.getEmote7TV(id);
            let name = res?.data?.emote?.name
            if (name){
                let emote = new Emote(name, id, type)
                return emote
            }
    }else if(type == TYPES.BETTERTTV){
        //get emote data
        let res = await NetworkManager.getEmoteBTTV(id);
        if (res.code){
            let emote = new Emote(res.code, id, type)
            return emote
        }
    }else if(type == TYPES.FFZ){
        //TODO
        let res = await NetworkManager.getEmoteFFZ(id);
    }else if(type == TYPES.TWITCH){
        //TODO
        
    }
}

export function getCDN(emote){
    let cdn = CDNS[emote.type];
    cdn = cdn.replace("EMOTE_ID", emote.id);
    return cdn;
}

export class Emote{
    constructor(name, id, type){
        this.name=name;
        this.id=id;
        this.type=type;
    }
}