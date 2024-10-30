import React, {useState, useEffect} from "react"
import axios from "axios"
import { m } from "framer-motion";

let CLIENT_SECRET = "";
let CLIENT_ID = "";
let REDIRECT_URI = "";
let SCOPE = "user-read-playback-state user-read-currently-playing";
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
    console.log("logging-in");
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
        console.log("reloading...");
        RequestAuthCode(localStorage["client_id"], localStorage["client_secret"], localStorage["redirect_uri"]);
        
    });
    console.log(data);
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
        console.log(itemsCount);
        if(res.data.currently_playing!=null){
            albumData.push({
                name: res.data.currently_playing.name,
                artist: res.data.currently_playing.artists[0].name,
                artworkURL: res.data.currently_playing.album.images[0].url,
            });
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
        console.log("reloading...");
        RequestAuthCode(localStorage["client_id"], localStorage["client_secret"], localStorage["redirect_uri"]);
        
    });
    return albumData;
}
