import React, {useState, useEffect} from "react"
import axios from "axios"

let CLIENT_SECRET = "";
let CLIENT_ID = "";
let REDIRECT_URI = "";
let SCOPE = "user-read-private user-read-email";
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

export async function useAuth(code)
{
    //GETS THE LOCALLY STORED DATA FROM THE AUTHORIZE CODE STAGE
    CLIENT_ID = localStorage["client_id"];
    CLIENT_SECRET = localStorage["client_secret"];
    REDIRECT_URI = localStorage["redirect_uri"];
    //HOOKS FOR SETTING DATA
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [expiresIn, setExpiresIn] = useState("");
    
    console.log("accessing api");
    let attempt = {};
    try{
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
    });
    }
    catch(error){
        console.log("There was an error fetching access token. Refreshing auth code...");
        //RequestAuthCode(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    }
    //IF THE ATTEMPT TO GET THE ACCESS TOKEN AND REFRESH TOKEN WAS SUCCESSFUL...
    if(attempt.status == 200){
        console.log("Saving tokens to local storage..")
        localStorage["access_token"] = attempt.data.access_token;
        localStorage["refresh_token"] = attempt.data.refresh_token;
        localStorage["expires_in"] = attempt.data.expires_in;
        setAccessToken(attempt.data.access_token);
        setRefreshToken(attempt.data.refresh_token);
        setExpiresIn(attempt.data.expires_in);
    }
}
async function GetQueueData()
{
    /*
    if(localStorage["access_token"] == null) return null;
    let attempt = await axios.get(BASE_URL + "me/player/queue",{
        headers:{
            "Authorization": "Bearer " + 
        }
    })*/
}
