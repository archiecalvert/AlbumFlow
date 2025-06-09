/*

Gets the users queue data from the spotify API

Parameters:
    accessToken: the currently active access token
Returns:
    data array: contains an array of data with
                - artist name
                - album name
                - artwork url

*/
export async function GetQueue(accessToken) {

    if (accessToken == null || accessToken == undefined) {
        console.log("No token provided");
        return;
    }

    let returndata = null;
    await fetch("https://api.spotify.com/v1/me/player/queue", {
        method: "get",
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    }).then(async (response) => {
        let res = await response.json()

        let data = []
        // Adds the current song details to the queue data
        if (res.currently_playing != null) {
            data[0] = {
                name: res.currently_playing.name,
                artist: res.currently_playing.artists[0].name,
                artwork: res.currently_playing.album.images[0].url,
            }
        }

        // Adds the queue data
        for (let i = 0; i < res.queue.length; i++) {
            data[i + 1] = {
                name: res.queue[i].name,
                artist: res.queue[i].artists[0].name,
                artwork: res.queue[i].album.images[0].url,
            }
        }
        returndata = data
    })
    return returndata;
}

/*

Gets the users queue playlists from the spotify API

Parameters:
    accessToken: the currently active access token
Returns:
    data array: contains an array of data with the relevant data from the API

*/
export async function GetUserSavedAlbums(accessToken) {
    let data = null
    await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "get",
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    }).then(async (res) => {
        data = await res.json()
    })
    return data;
}

/*

Toggles the pause/unpause on the users device

Parameters:
    accessToken: the currently active access token
Returns:
    boolean: whether the player is paused

*/
export async function TogglePlayback(accessToken) {
    let data = null;
    await fetch("https://api.spotify.com/v1/me/player", {
        method: "get",
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    }).then(async (res) => {
        let data1 = await res.json();
        let url = ""
        if (data1.is_playing) {
            url = "https://api.spotify.com/v1/me/player/pause"
        }
        else {
            url = "https://api.spotify.com/v1/me/player/play"
        }
        await fetch(url, {
            method: "put",
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }).then(async (res2) => {
            if (await res2.status == 200) {
                data = data1.is_playing;
            }

        })
    })
    return data;
}

/*

Parameters:
    accessToken: the currently active access token
Returns:
    boolean: whether the action was successful

*/
export async function PlayNextSong(accessToken) {
    let data = null;
    await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "post",
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    }).then(async (res) => {
        data = await res.status == 200
    });
    return data;
}

/*

Parameters:
    accessToken: the currently active access token
Returns:
    boolean: whether the action was successful

*/
export async function PlayPreviousSong(accessToken) {
    let data = null;
    await fetch("https://api.spotify.com/v1/me/player/previous", {
        method: "post",
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    }).then(async (res) => {
        data = await res.status == 200
    });
    return data;
}

/*

Gets the state of the player

*/
export async function GetPlaybackState(accessToken) {
    let data = null;
    await fetch("https://api.spotify.com/v1/me/player", {
        method: "get",
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    }).then(async (res) => {
        data = await res.json();
    });
    return data;
}

export async function PlayPlaylistOrSong(accessToken, uri, playlist_id) {
    let data = []
    await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "put",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        body: JSON.stringify({
            context_uri: uri
        })
    }).then(async (res1) => {
        if(await res1.status == 204)
        {
            await fetch("https://api.spotify.com/v1/playlists/" + playlist_id, {
                method: "get",
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
            }).then(async res2 => {
                let res = await res2.json()
                // Adds the queue data
                
                for (let i = 0; i < res.tracks.items.length; i++) {
                    data[i] = {
                        name: res.tracks.items[i].track.name,
                        artist: res.tracks.items[i].track.artists[0].name,
                        artwork: res.tracks.items[i].track.album.images[0].url,
                    }
                }
                
            })

        }

    })
    return data;
}