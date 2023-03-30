export class NetworkManager{
    //basic get
    static REQUEST(endpoint, option={}){
        return new Promise((resolve,reject)=>{
            fetch(endpoint, option)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
    }

    //gets id of user by the given username
    static getUserId = (username) => {
        return this.REQUEST(`api/v1/channels/${username}`);
    }

    static getEmote7TV(emoteId){
        return this.REQUEST("https://7tv.io/v3/gql", {
            "headers": {
                "accept": "*/*",
                "content-type": "application/json",
              },
              "body": "{\"operationName\":\"Emote\",\"variables\":{\"id\":\""+emoteId+"\"},\"query\":\"query Emote($id: ObjectID!) {\\n  emote(id: $id) {\\n    id\\n    created_at\\n    name\\n    lifecycle\\n    state\\n    trending\\n    tags\\n    owner {\\n      id\\n      username\\n      display_name\\n      avatar_url\\n      style {\\n        color\\n        paint_id\\n        __typename\\n      }\\n      __typename\\n    }\\n    flags\\n    host {\\n      ...HostFragment\\n      __typename\\n    }\\n    versions {\\n      id\\n      name\\n      description\\n      created_at\\n      lifecycle\\n      state\\n      host {\\n        ...HostFragment\\n        __typename\\n      }\\n      __typename\\n    }\\n    animated\\n    __typename\\n  }\\n}\\n\\nfragment HostFragment on ImageHost {\\n  url\\n  files {\\n    name\\n    format\\n    width\\n    height\\n    size\\n    __typename\\n  }\\n  __typename\\n}\"}",
              "method": "POST",
        })
    }
    
    static getEmoteBTTV(emoteId){
        return this.REQUEST("https://api.betterttv.net/3/emotes/" + emoteId);
    }

    static getEmoteFFZ(emoteId){
        return this.REQUEST("https://api.frankerfacez.com/v1/" + emoteId);
    }


}