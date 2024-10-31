import React, {useState, useEffect} from "react"
import axios from "axios"
import { m } from "framer-motion";

let CLIENT_SECRET = "";
let CLIENT_ID = "";
let REDIRECT_URI = "";
let DEBUG = false;
let SCOPE = "user-modify-playback-state user-read-playback-state user-read-currently-playing";
//USED TO GET TOKENS FROM THE API
const AUTH_URL = "https://accounts.spotify.com/authorize";

//USED TO REFRESH THE ACCESS TOKEN, MAKING USE OF THE REFRESH TOKEN
const REFRESH_URL = "https://accounts.spotify.com/api/token";

//USED TO GET DATA FROM THE API
const BASE_URL = "https://api.spotify.com/v1/";

//This function gets the authorization code from the spotify api.
//This code is then used to get the access token and the refresh token, where these can be used to request data from the spotify api
export function RequestAuthCode(id, secret, uri)
{
    CLIENT_ID = id;
    CLIENT_SECRET = secret;
    REDIRECT_URI = uri;
    //STORES THE CLIENT CREDENTIALS TO LOCAL STORAGE
    localStorage["client_id"] = id;
    localStorage["client_secret"] = secret;
    localStorage["redirect_uri"] = uri;
    //CLEARS THE ACCESS TOKENS TO AVOID OLD ONES BEING USED
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
    //BUILDS THE AUTH URL WHICH GOES TO THE LOGIN PAGE
    var request_url = AUTH_URL + "?response_type=code";
    request_url += '&client_id=' + encodeURIComponent(CLIENT_ID);
    request_url += '&scope=' + encodeURIComponent(SCOPE);
    request_url += '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
    //REDIRECTS THE USER TO THE LOGIN PAGE
    window.location.href = request_url
}

export async function GetAccessToken(code)
{
    //GETS THE LOCALLY STORED DATA FROM THE AUTHORIZE CODE STAGE
    let data = null;
    CLIENT_ID = localStorage["client_id"];
    CLIENT_SECRET = localStorage["client_secret"];
    REDIRECT_URI = localStorage["redirect_uri"];
    localStorage["access_token"] = "";
    let attempt = {};
    //REQUEST TO GET THE ACCESS TOKEN AND REFRESH TOKEN
    attempt = await axios.post(REFRESH_URL, {
        //BODY/PAYLOAD OF THE REQUEST
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI
    },
    {
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
    }).then((res)=> {
        localStorage["access_token"] = res.data.access_token;
        data = res;
        return res;
    }).catch(e => {
        if(!DEBUG) RequestAuthCode(localStorage["client_id"], localStorage["client_secret"], localStorage["redirect_uri"]);
        
    });
    if(data!= null)
    {
        return data;
    }
    //IF THE ATTEMPT TO GET THE ACCESS TOKEN AND REFRESH TOKEN WAS SUCCESSFUL...
}
export async function GetQueueData(access_token)
{   
    var albumData=[];
    let attempt = await axios.get(BASE_URL + "me/player/queue",{
        headers:{
            "Authorization": "Bearer " + access_token
        },  
    }).then((res)=> {
        let queueData = res.data.queue;
        let itemsCount = queueData.length;
        if(res.data.currently_playing!=null){
            albumData.push({
                name: res.data.currently_playing.name,
                
                artist: res.data.currently_playing.artists[0].name,
                artworkURL: res.data.currently_playing.album.images[0].url,
            });
            if(res.data.currently_playing.artists.length > 1)
            {
                for(let i = 0; i < res.data.currently_playing.artists.length -1; i++)
                {
                    albumData[0].artist += ", " + res.data.currently_playing.artists[i+1].name;
                }
            }
        }
        
        for(let i=0; i<itemsCount; i++)
        {
            albumData.push({
                name: res.data.queue[i].name,
                artist: res.data.queue[i].artists[0].name,
                artworkURL: res.data.queue[i].album.images[0].url,
            });
        }
        if(albumData.length == 0)
        {
            albumData.push({
                name: null,
                artist: null,
                artworkURL: null,
            });
        }
        localStorage["queueData"] = JSON.stringify(albumData);
        return albumData;
    }).catch(e => {
        if(!DEBUG) RequestAuthCode(localStorage["client_id"], localStorage["client_secret"], localStorage["redirect_uri"]);
        
    });
    return albumData;

}
export async function GetCurrentSong()
{
    let data = null;
    await GetQueueData(localStorage["access_token"]).then((res)=> {
        if(res.length > 0)
        {
            data = res[0];
            
        }
    })
    if(data == null) return null;
    
    return ({
        name: data.name,
        artist: data.artist,
    });
}
export async function SendRequest(url)
{
    console.log(localStorage["access_token"]);
    let attempt = axios.post(BASE_URL + url,
        {
            Authorization: "Bearer " + localStorage["access_token"],
        },
        {
        headers:{
            "Authorization": "Bearer " + localStorage["access_token"]
        }
    }).then((res)=> { return res; });
}
export async function PlayNext()
{
    await SendRequest("me/player/next").catch(e => {});
}
export async function PausePlayback()
{
    let attempt = axios.put(BASE_URL + "me/player/pause",
        {
            Authorization: "Bearer " + localStorage["access_token"],
        },
        {
        headers:{
            "Authorization": "Bearer " + localStorage["access_token"]
        }
    }).then((res)=> {
        console.log(res.status);
        localStorage["isPlaying"] = false;
    }).catch(e => {
        if(e.status == 403){
            localStorage["isPlaying"] = true;
            console.log("User has paused playback");
            axios.put(BASE_URL + "me/player/play",
                {
                    Authorization: "Bearer " + localStorage["access_token"],
                },
                {
                headers:{
                    "Authorization": "Bearer " + localStorage["access_token"]
                }}).then(()=>{});
        }
    });
}
export async function PlayPrev()
{
    await SendRequest("me/player/previous").catch(e => {});
}
