import React, {useState, useEffect} from "react"
import axios from "axios"
import { m } from "framer-motion";

let DEBUG = false;
let CLIENT_ID = "4dcdaa9525454b5d95a9e39bdcf64a62";
let REDIRECT_URI = "https://archiecalvert.github.io/albumflow";
if(location.hostname == "localhost")
{
    REDIRECT_URI = "http://localhost:5173/albumflow";
}
let SCOPE = "user-modify-playback-state user-read-playback-state user-read-currently-playing";
//USED TO GET TOKENS FROM THE API
const AUTH_URL = "https://accounts.spotify.com/authorize";

//USED TO REFRESH THE ACCESS TOKEN, MAKING USE OF THE REFRESH TOKEN
const REFRESH_URL = "https://accounts.spotify.com/api/token";

//USED TO GET DATA FROM THE API
const BASE_URL = "https://api.spotify.com/v1/";

//This function gets the authorization code from the spotify api.
//This code is then used to get the access token and the refresh token, where these can be used to request data from the spotify api
export async function RequestAuthCode()
{
    //TAKEN FROM THE SPOTIFY API DOCUMENTATION FOR AUTH WITH PKCE
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
     
    const codeVerifier  = generateRandomString(64);
    const sha256 = async (plain) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
    }
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
    window.localStorage["code_verifier"] = codeVerifier;
    const authUrl = new URL("https://accounts.spotify.com/authorize")
    const params =  {
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPE,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: REDIRECT_URI,
      }
      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
}

export async function GetAccessToken()
{
    //GETS THE LOCALLY STORED DATA FROM THE AUTHORIZE CODE STAGE
    let data = null;
    let attempt = {};
    //REQUEST TO GET THE ACCESS TOKEN AND REFRESH TOKEN
    attempt = await axios.post(REFRESH_URL, {
        //BODY/PAYLOAD OF THE REQUEST
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code: new URLSearchParams(window.location.search).get("code"),
        redirect_uri: REDIRECT_URI,
        code_verifier: localStorage["code_verifier"]
    },
    {
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then((res)=> {
        localStorage["access_token"] = res.data.access_token;
        data = res;
        return res;
    }).catch(e => {
        if(!DEBUG) RequestAuthCode();
        
    });
    if(data!= null)
    {
        return data;
    }
    //IF THE ATTEMPT TO GET THE ACCESS TOKEN AND REFRESH TOKEN WAS SUCCESSFUL...
}
export async function GetQueueData()
{   
    var albumData=[];
    let attempt = await axios.get(BASE_URL + "me/player/queue",{
        headers:{
            "Authorization": "Bearer " + localStorage["access_token"]
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

        if(e.status == 401)
        {
            GetAccessToken();
        }
        
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

    }).catch(e => {
        if(e.status == 403){

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
export async function GetUserDetails()
{
    let data = null;
    let attempt = await axios.get(BASE_URL + "me",
        {
            headers:{
                "Authorization": "Bearer " + localStorage["access_token"]
            }
        }).then((res)=> {
            console.log(res);
            data = {
                name: res.data.display_name,
                picture_url: res.data.images.length == 0 ? "/albumflow/profilepic.jpg" : res.data.images[0].url,
                profile_url: res.data.external_urls.spotify,
            }
        })
        return data;
}
export async function GetCurrentSongDetails()
{
    let song = null;
    await axios.get(BASE_URL + "me/player",{
        headers:{
            "Authorization": "Bearer " + localStorage["access_token"]
        },
    }).then((res)=> {
        song ={
            name: res.data.item.name,
            artist: res.data.item.artists[0].name,
            artworkURL: res.data.item.album.images[0].url,
            is_playing: res.data.is_playing,
        }
    })
    localStorage["isPlaying"] = song.is_playing;
    return song;

}