"use client";
import { LogIn, RefreshToken } from "@/api/auth";
import tinycolor from "tinycolor2";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Vibrant } from "node-vibrant/browser";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { GetPlaybackState, GetQueue, GetUserSavedAlbums, PlayNextSong, PlayPreviousSong, Search, TogglePlayback, TryPlayOnDevice } from "@/api/player";
import PlaylistMenu from "@/components/playlistmenu";
import SearchBar from "@/components/searchbar";
import Button from "@/components/button";

export default function Page() {

    // Reference to the main swiper
    const [albumSwiper, SetAlbumSwiper] = useState(null);

    // Secondary Reference to the main swiper
    const albumRef = useRef(albumSwiper);

     /* Holds the data of the current queue
       This is in an object with the values:
           - name : The name of the album/data item
           - artist : The name of the artist which created the item
           - artwork : A URL that contains the album artwork
    */
    const [queueData, SetQueueData] = useState([]);

    // Keeps track of the browser window dimensions
    const [windowWidth, SetWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);
    const [windowHeight, SetWindowHeight] = useState(typeof window !== "undefined" ? window.innerHeight: 1080);
    
    // Keeps track of the number of album artworks on screen
    const [artCount, SetArtCount] = useState(null);

    // Holds data on the data for the playlist sidebar
    const [playlistData, SetPlaylistData] = useState([]);

    // Holds the current title and artist of the player
    const [currentTitle, SetCurrentTitle] = useState("");
    const [currentArtist, SetCurrentArtist] = useState("");

    // Whether the API data has all been successfully obtained
    const [isLoaded, SetIsLoaded] = useState(false);

    // Whether the player is currently paused
    const [paused, SetIsPaused] = useState(true);

    // The current position in the song, and the total length of the song (measure in milliseconds)
    const [playbackState, SetPlaybackState] = useState([]);

    // Flag to refetch data from the API
    const [reloadPlayer, SetReloadPlayer] = useState(false);

    // Array holding temporary new data on reload until the data from the API has been fetched
    const [tempQueueData, SetTempQueueData] = useState(null);

    // Colour for the background theme of the player
    const [backgroundColours, SetBackgroundColours] = useState([])

    // Spotify Player object from the web playback SDK
    const [player, setPlayer] = useState(undefined)

    // The device ID of the browser
    const [deviceID, SetDeviceID] = useState(null);

    // The current title given by the player object
    const [currentTrack, SetCurrentTrack] = useState(null);

    // Renames the window of the browser
    if (typeof window !== "undefined") document.title = "Player | AlbumFlow";

    // Initiates a new spotify player instance
    useEffect(() => {

        // Adds event listeners to keep track of the window size
        window.addEventListener("resize", () => {
            SetWindowWidth(window.innerWidth);
            SetWindowHeight(window.innerHeight);
        });

        // If there is an error trying to get new credentials
        if (localStorage["access"] == undefined || localStorage["refresh"] == undefined) {
            LogIn()
        }

        // (FROM SPOTIFY WEB PLAYER SDK DOCS)
        // Loadds the necessary scripts for the Web SDK
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
        window.onSpotifyWebPlaybackSDKReady = () => {
            // Creates the player object
            const player = new window.Spotify.Player({
                name: 'AlbumFlow',
                getOAuthToken: cb => { cb(localStorage["access"]); },
                volume: 0.5
            });

            // Saves the object
            setPlayer(player);

            // Once loaded, it will get the device ID of the browser
            player.addListener('ready', ({ device_id }) => {
                SetDeviceID(device_id)
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.connect();

    };
    }, []);

    useEffect(() => {
        // Checks to see if the player and device id have been obtained
        if(deviceID == null || deviceID == undefined) return
        if(player == null || player == undefined) return

        async function GetData() {

            // Will then try to play on the SDK device
            TryPlayOnDevice(localStorage["access"], deviceID);

            // Refreshes the users access token when the page is refreshed
            const response1 = await RefreshToken(localStorage["refresh"]);
            if (response1.status == 200) {
                localStorage["access"] = response1.access;
                localStorage["refresh"] = response1.refresh;
            } else {
                LogIn()
            }

            // Additional checks to see if the API call was successful
            if (localStorage["access"] != null && localStorage["access"] != undefined) {
                const token = localStorage["access"];

                // Makes all the API Calls in parallel
                const responses = await Promise.allSettled([GetQueue(token), GetUserSavedAlbums(token), GetPlaybackState(token), calculateArtCount()]);

                // Attempts to add all the API data to the respective variables
                try {
                    SetQueueData(await responses[0].value);
                    SetPlaylistData(await responses[1].value);
                    SetIsPaused(!(await responses[2].value.is_playing));
                    SetPlaybackState([await responses[2].value.progress_ms, await responses[2].value.item.duration_ms]);
                    
                } catch (err) {
                } finally {
                    SetIsLoaded(true);
                }
            }
        }
        GetData();
    }, [deviceID, player])

    /*
        Main State Update loop
    */
    useEffect(() => {
        // Responsible for keeping the player updated
        const i1 = setInterval(() => {

            // Checks to see if the Web SDK player is active
            if(player == undefined || player == null) return;

            // Updates the current state of the player
            player.getCurrentState().then(async e=>{
                if(await e == null || await e == undefined) return;
                if(await e.track_window == null || e.track_window == undefined) return
                SetCurrentTrack(await e.track_window.current_track.name)
                SetPlaybackState([await e.position, await e.duration])
                SetIsPaused(await e.paused)
            })
            
            // Checks to see if there is queue data
            if(queueData == null || albumSwiper == null || queueData[albumSwiper.activeIndex] == undefined || albumSwiper == undefined) return;
            
            // Gets the most common vibrant colours from the album artwork
            Vibrant.from(albumSwiper.el.childNodes[0].childNodes[albumSwiper.activeIndex].children[0].src)
                .getPalette()
                .then((palette) => {
                    let data = palette.Vibrant._rgb;
                    let data2 = palette.LightVibrant._rgb//subtractChannels(data, 50);
                    let data3 = palette.DarkVibrant._rgb;
                    SetBackgroundColours([data, data2, data3]);
                });


        }, 100);
        
        // Responsible for keeping the access tokens up to data
        const i2 = setInterval(
            () => {
                
                // Refreshes the access token after 50 minutes
                RefreshToken(localStorage["refresh"]).then((vals) => {
                    localStorage["access"] = vals.access;
                    localStorage["refresh"] = vals.refresh;
                });
            },
            1000 * 60 * 50,
        );

        // Clears the intervals to avoid them being added over and over again
        return () => {
            clearInterval(i1)
            clearInterval(i2);
        };
        
    }, [queueData, albumSwiper, playbackState, paused, currentTrack, player]);


    // Responsible for the queue reload logic
    useEffect(() => {
        if (albumSwiper == null) return;
        if(reloadPlayer == false) return;
        SetQueueData(tempQueueData);
        albumSwiper.slideTo(0);
    }, [reloadPlayer, tempQueueData]);

    /*
        Updates the queue to the most recent data from spotify
    */
    async function UpdateQueue() {
        await GetQueue(localStorage["access"]).then(async (e) => {
            // If there is no data from the API...
            if (await e.length == 0) {
                SetQueueData([]);
                return;
            }

            // Gets the position of the current item in the queue
            let index = -1;
            for (let i = 0; i < queueData.length; i++) {
                if (queueData[i].name == await e[0].name) {
                    index = i;
                }
            }

            // If the current item cant be found
            if (index == -1) {
                if (await e.length != 0) {
                    SetQueueData(e);
                }
                return;
            }

            // Adds the new data to the end of the queue data array
            let tempArray = queueData;
            for (let j = 0; j < await e.length; j++) {
                tempArray[j + index] = await e[j];
            }

            SetQueueData(tempArray);
        });
    }

    // Repsonsible for formatting the time from miliseconds to seconds, minutes and hours
    function ConvertMilliToTime(time) {
        var ms = time % 1000;
        time = (time - ms) / 1000;
        var secs = time % 60;
        time = (time - secs) / 60;
        var mins = time % 60;
        var hrs = (time - mins) / 60;

        return `${hrs != 0 ? hrs + ":" : ""}${mins}:${("" + secs).length == 1 ? "0" + secs : secs}`;
    }
    
    //Responsible for calculating the scaling for the carousel to mobile/smaller screen sizes
    function calculateArtCount() {
        if (windowWidth < 700) SetArtCount(2);
        else if (windowWidth < 900) SetArtCount(3);
        else if (windowWidth < 1100) SetArtCount(4);
        else SetArtCount(5);
    }

    useEffect(() => {
        if (albumSwiper == null) return;
        albumRef.current = albumSwiper;
        const i = albumSwiper.activeIndex;
        if (queueData == null || queueData[i] == undefined) return;
        SetCurrentTitle(queueData[i].name);
        SetCurrentArtist(queueData[i].artist);
    }, [queueData, albumSwiper]);
    
    // Responsible for scaling the carousel to mobile/smaller screen sizes
    useEffect(() => {
        calculateArtCount();
    }, [windowWidth, windowHeight]);

    // Repsonsible for checking if the browser is in dark mode
    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }


    // Converts values from RBG to hex
    function rgbToHex(value) {
        if(value == undefined) return "#ffffff"
        return (
            '#' +
            value
            .map((val) => {
                const hex = val.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            })
            .join('')
        );
    }

    // Blank intermediate page
    if (!isLoaded) return <></>;

    // Content for when the player fails to load
    if (deviceID == null || deviceID == undefined) return (

        <motion.div className="absolute flex items-center flex-col top-0 w-[100vw] h-[100vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{}}>
            <div className="my-auto text-center w-[80%]">
                <h1 className="text-[35px]">No Device Found</h1>
                <Button onClick={()=>{console.log(deviceID)}}>C</Button>
                <h1 className="text-[20px] opacity-[50%]">Start playing music on Spotify to begin.</h1>
            </div>
        </motion.div>

    );
    return (
        <div style = {{background: `${backgroundColours[0] != undefined && `linear-gradient(to bottom, rgba(${backgroundColours[1][0]}, ${backgroundColours[1][1]}, ${backgroundColours[1][2]}, 1), rgba(${backgroundColours[2][0]}, ${backgroundColours[2][1]}, ${backgroundColours[2][2]}, 1))`}`}}>
            <SearchBar SetNewData={SetTempQueueData} SetReload={SetReloadPlayer} className={"z-[100] absolute top-[15px] mx-[50%] -translate-x-1/2"}></SearchBar>

            <motion.div style={{ backgroundColor: `${backgroundColours[0] != undefined && `rgba(${backgroundColours[0][0]}, ${backgroundColours[0][1]}, ${backgroundColours[0][2]}, 0.5)`}`, transition: 'background 0.75s ease', height:"calc(100vh)", }} className="transition-colors duration-1000 mt-[-50px] flex items-center overflow-hidden text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{}}>
                <div className="min-w-0">
                <Swiper
                    effect={"coverflow"}
                    id="swiper"
                    allowTouchMove={false}
                    cssMode={false}
                    grabCursor={false}
                    centeredSlides={true}
                    slidesPerView={artCount}
                    coverflowEffect={{
                        rotate: 15,
                        stretch: 0,
                        depth: 200,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    pagination={false}
                    modules={[EffectCoverflow, Navigation]}
                    className="!-z-0 min-w-[250px] overflow-hidden"
                    onSwiper={(e) => {
                        SetAlbumSwiper(e);
                    }}
                    onSlideChange={(e) => {
                        const i = e.activeIndex;

                        SetCurrentTitle(queueData[i].name);
                        SetCurrentArtist(queueData[i].artist);
                    }}
                >
                    {
                        // Adds all the album artwork to the carousel
                        queueData != null &&
                            queueData.map((item, index) => {
                                if (item.artwork == null) return <></>;
                                return (
                                    <SwiperSlide key={index}>
                                        <img className="aspect-square rounded-lg shadow-xl w-full h-full my-[50px]" src={item.artwork}></img>
                                    </SwiperSlide>
                                );
                            })
                    }
                </Swiper>
                {queueData != null && queueData.length != 0 && (
                    <div className="mb-[50px] grid space-y-5 max-cols-1 w-[40%] max-medium700:w-[80%] mx-[50%] -translate-x-1/2">
                        <>
                            <h1 style={{transition: 'color 0.1s ease', color: `${backgroundColours[0] != undefined && backgroundColours[0] != null ? tinycolor.mostReadable(tinycolor(rgbToHex(backgroundColours[1])), ['#000000', '#ffffff']).toHexString() : "rgba(0,0,0,0)"}`}} className="invert text-nowrap overflow-x-hidden text-[30px]">{currentTitle}</h1>
                            <h1 style={{transition: 'color 0.1s ease', color: `${backgroundColours[0] != undefined && backgroundColours[0] != null ? tinycolor.mostReadable(tinycolor(rgbToHex(backgroundColours[1])), ['#000000', '#ffffff']).toHexString() : "rgba(0,0,0,0)"}`}} className="invert text-nowrap overflow-x-hidden text-[15px]">{currentArtist}</h1>
                            <div style={{transition: 'background 0.1s ease', backgroundColor: `${backgroundColours[0] != undefined && backgroundColours[0] != null ? tinycolor.mostReadable(tinycolor(rgbToHex(backgroundColours[1])), ['rgba(0,0,0,0.35)', 'rgba(256, 256, 256, 0.35)']).toRgbString() : "rgba(0,0,0,0)"}`}} className="invert h-[5px] w-full rounded-full overflow-hidden">
                                <div style={{transition: 'background 0.1s ease', backgroundColor: `${backgroundColours[0] != undefined && backgroundColours[0] != null ? tinycolor.mostReadable(tinycolor(rgbToHex(backgroundColours[1])), ['#000000', 'rgba(256, 256, 256, 0.6)']).toRgbString() : "rgba(0,0,0,0)"}`, width: `calc(${(100 * playbackState[0]) / playbackState[1]}%)` }} className="!opacity-[100%] bg-gray-500 dark:bg-white h-full"></div>
                            </div>
                            <div className="invert flex justify-between opacity-[50%]">
                                <h1 style={{transition: 'color 0.1s ease', color: `${backgroundColours[0] != undefined && backgroundColours[0] != null ? tinycolor.mostReadable(tinycolor(rgbToHex(backgroundColours[1])), ['#000000', '#ffffff']).toHexString() : "rgba(0,0,0,0)"}`}}>{ConvertMilliToTime(playbackState[0])}</h1>
                                <h1 style={{transition: 'color 0.1s ease', color: `${backgroundColours[0] != undefined && backgroundColours[0] != null ? tinycolor.mostReadable(tinycolor(rgbToHex(backgroundColours[1])), ['#000000', '#ffffff']).toHexString() : "rgba(0,0,0,0)"}`}}>{ConvertMilliToTime(playbackState[1])}</h1>
                            </div>
                            <span className={`grid grid-rows-1 grid-cols-3 items-center w-full ${(backgroundColours[0] != undefined && backgroundColours[0] != null ? tinycolor.mostReadable(tinycolor(rgbToHex(backgroundColours[1])), ['#000000', '#ffffff']).toHexString() : "rgba(0,0,0,0)") != "#ffffff" ? "invert" : ""}`}>
                                <img
                                    className={`max-medium700:mx-5 hover:cursor-pointer justify-self-end max-w-[30px] max-medium700:max-w-[25px] max-h-[30px]`}
                                    src="/backward-icon.png"
                                    onClick={() => {
                                        PlayPreviousSong(localStorage["access"]).then(async(e3) => {
                                            if (e3) {

                                                // Applies a correction to the skip so the queue is always right                                              
                                                const state = await player.getCurrentState();
                                                const name = state.track_window.current_track.name;
                                                for (let i = 0; i < queueData.length; i++) {
                                                    if (name == queueData[i].name) {

                                                        albumSwiper.slideTo(i);
                                                        break
                                                    }
                                                }
                                                UpdateQueue()
                                                SetIsPaused(false);
                                                SetPlaybackState(c=>[0, playbackState[1]])

                                            }
                                        });
                                    }}
                                ></img>
                                {paused ? (
                                    <img
                                        className="max-medium700:max-w-[50px] hover:cursor-pointer justify-self-center invert max-w-[40px] max-h-[40px]"
                                        src="/pause.png"
                                        onClick={() => {
                                            if(player == undefined) return;
                                            player.resume()
                                            SetIsPaused(false);
                                        }}
                                    ></img>
                                ) : (
                                    <img
                                        className="max-medium700:max-w-[50px] hover:cursor-pointer justify-self-center invert max-w-[40px] max-h-[40px]"
                                        src="/play.png"
                                        onClick={() => {
                                            if(player == undefined) return;
                                            player.pause();
                                            SetIsPaused(true)
                                        }}
                                    ></img>
                                )}
                                <img
                                    className="max-medium700:mx-5 max-medium700:max-w-[25px] hover:cursor-pointer max-w-[30px] max-h-[30px]"
                                    src="/forward-icon.png"
                                    onClick={() => {
                                        PlayNextSong(localStorage["access"]).then(async (e2) => {
                                            if (await e2) { 
                                                
                                                // Applies a correction to the skip so the queue is always right                                              
                                                const state = await player.getCurrentState();
                                                const name = state.track_window.current_track.name;

                                                for (let i = 0; i < queueData.length; i++) {
                                                    if (name == queueData[i].name) {
                                                        albumSwiper.slideTo(i);
                                                        break;
                                                    }
                                                }
                                                UpdateQueue()
                                                SetIsPaused(false);
                                                SetPlaybackState(c=>[0, playbackState[1]])
                                        
                                            }
                                        });
                                    }}
                                ></img>
                            </span>
                        </>
                    </div>
                )}
                </div>
            </motion.div>
            
        </div>
    );
}
