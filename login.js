import express from 'express';
import dotenv from "dotenv";
import { generateRandomString } from './helpers.js';
import QueryString from 'qs';

// loads env
dotenv.config("./");

// api router
const loginRouter = express.Router();

/* 

Used to log in the user to spotify
Do not do an API call to this, going to it's url will cause the redirect
This will return:
            (these will be contained in the redirected URL)
    Authentication Code: used to get access tokens
    State: the random string generated before redirecting

*/

loginRouter.get("/login", async (req, res) => {
    
    
    var state = generateRandomString(16);

    // What the application has access to, which also limits API access
    var scope = process.env.SCOPE;

    // Redirects the browser to the log in screen
    res.redirect('https://accounts.spotify.com/authorize?' +
            QueryString.stringify({
            response_type: 'code',
            client_id: process.env.PUBLIC_KEY,
            scope: scope,
            redirect_uri: process.env.REDIRECT_URI,
            state: state
        }));
});

/*

This is used to get the access tokens to allow for the app to interact
with the spotify API.

Prerequisites:
    Must have gone through the "login" route to get authetication code and state

Returns:
    Access Token: Used to call the API
    Refresh Token: Used to refresh the access token once expired
    Scope: What the access token is limited to do
    Expires In: when the access token expires
    Token Type: always 'Bearer'

*/
loginRouter.post("/authenticate", async(req, res) => {
    // URL parameters from the "login" route
    let auth_code = req.body.auth_code || null;
    let state = req.body.state || null;

    // Null checks the values
    if(auth_code == null || state == null || auth_code == undefined || state == undefined
    ) return res.status(400).json("Missing authentication parameters (auth_code and/or state)");

    await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + (new Buffer.from(process.env.PUBLIC_KEY + ':' + process.env.PRIVATE_KEY).toString('base64')),
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: auth_code,
            redirect_uri: process.env.REDIRECT_URI
        })
    }).then(async(response) => {
            let code = await response.status;
            if(code == 200)
            {
                const jdata = await response.json();
                const data = {
                    status: 200,
                    access :jdata.access_token,
                    refresh :jdata.refresh_token,
                    type :jdata.token_type,
                    expires_in :jdata.expires_in,
                    scope :jdata.scope,
                }

                return res.status(200).json(data);
            }
            else
            {
                return res.status(400).json({status:400, error:"Bad Authentication"});
            }
        }
    )
})

/*

Takes in a refresh token, and will return a new set of refresh and access tokens if successful.

Parameters:
    token: The currently active refresh token

Returns:
    Access Token: The new access token
    Refresh Token: The new refresh token

*/
loginRouter.post("/refresh", async (req, res) => {

    // Gets the token out from the body
    const refresh_token = req.body.token || null;

    // Null checks the input
    if(refresh_token == null || refresh_token == undefined) return res.status(400).json("Missing refresh token");

    await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + (new Buffer.from(process.env.PUBLIC_KEY + ':' + process.env.PRIVATE_KEY).toString('base64')),
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        })
    }).then(async(response) => {
            let code = await response.status;
            if(code == 200)
            {
                let jdata = await response.json();
                const data = {
                    status: 200,
                    access :jdata.access_token,
                    refresh :jdata.refresh_token || refresh_token,
                    type :jdata.token_type,
                    expires_in :jdata.expires_in,
                    scope :jdata.scope,
                }
                return res.status(200).json(data);
            }
        }
    )
})

export {loginRouter};