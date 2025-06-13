
const API_URL = "https://albumflow.archiecalvert.com"; //https://api.archiecalvert.com
/*

Redirects the page to the spotify login page which contains all the relevant data

Returns: (these are contained within the success URL)
    Authorisation Code: code produced by spotify
    State: state provided by the server

*/
export async function LogIn()
{
    window.location.href = API_URL + "/login"
}

/*

Using the Authorisation Code, this gets two tokens to be used on the API

Parameters:
    authCode: the authorisation code provided by the "LogIn" function
    state: the state provided by the "LogIn" function

*/
export async function GetTokens(authCode, state)
{
    let data = null;
    await fetch(API_URL + "/authenticate", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            auth_code: authCode,
            state: state 
        })
    }).then(async (res)=>{
        data = await res;
    })
    return data.json();
}

/*

Creates a new access token from the refresh token.

Parameters:
    refreshToken: the currently active refresh token

Returns:
    access: new access token
    refresh: new refresh token
*/
export async function RefreshToken(refreshToken)
{
    let data = null;
    await fetch(API_URL + "/refresh", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: refreshToken
        })
    }).then(async (res)=>{
        data = await res;
    })
    return data.json();
}