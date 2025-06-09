"use client";
import { LogIn, RefreshToken } from "@/api/auth";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { GetPlaybackState, GetQueue, GetUserSavedAlbums, PlayNextSong, PlayPreviousSong, TogglePlayback } from "@/api/player";
import PlaylistMenu from "@/components/playlistmenu";

export default function Page() {
    const [albumSwiper, SetAlbumSwiper] = useState(null);
    const albumRef = useRef(albumSwiper);
    const [queueData, SetQueueData] = useState([]);
    const [windowWidth, SetWindowWidth] = useState(window.innerWidth);
    const [windowHeight, SetWindowHeight] = useState(window.innerHeight);
    const [artCount, SetArtCount] = useState(null);
    const [playlistData, SetPlaylistData] = useState([]);

    const [currentTitle, SetCurrentTitle] = useState("");
    const [currentArtist, SetCurrentArtist] = useState("");
    const [currentPos, setCurrentPos] = useState(0);

    // Player State
    const [isLoaded, SetIsLoaded] = useState(false);
    const [paused, SetIsPaused] = useState(true);
    const [playbackState, SetPlaybackState] = useState([]);
    const [reloadPlayer, SetReloadPlayer] = useState(false);
    const [tempQueueData, SetTempQueueData] = useState(null);
    const [APIDelay, SetAPIDelay] = useState(20) // How many updates until the API is called
    const [APILimit, SetAPILimit] = useState(20)
    const [correctionDelay, SetCorrectionDelay] = useState(3)

    async function UpdateState() {
        const responses = Promise.allSettled([GetPlaybackState(localStorage["access"])]).then(async (vals) => {
            try {
                const temp = await vals[0].value.is_playing;
                SetIsPaused(!temp);
                SetPlaybackState([await vals[0].value.progress_ms, await vals[0].value.item.duration_ms]);

            } catch {
                (e) => console.log(e);
            }
        });
    }

    async function CheckIsCorrectPosition()
    {
        const responses = Promise.allSettled([GetPlaybackState(localStorage["access"])]).then(async (vals) => {
            try {
                if (vals[0].value.item.name != queueData[albumSwiper.activeIndex].name) {
                    let inQueue = false;
                    for (let i = 0; i < queueData.length; i++) {
                        if (vals[0].value.item.name == queueData[i].name) {
                            inQueue = true;
                            albumSwiper.slideTo(i);
                        }
                    }
                    if (!inQueue) window.location.href = "/player";
                }
            } catch {
                (e) => console.log(e);
            }
        });
    }
    /*
        Main State Update loop
    */
    useEffect(() => {
        const i1 = setInterval(() => {
            SetAPIDelay(c => c+1)
            if(APIDelay >= APILimit) 
            {
                
                if(correctionDelay == 3)
                {
                    SetCorrectionDelay(0)
                    CheckIsCorrectPosition();
                }
                SetCorrectionDelay(c=>c+1)
                SetAPIDelay(0)
                UpdateState();
            }
            else{
                if(!paused) SetPlaybackState(c => [c[0] + 100, c[1]])
            }

        }, 100); //after every second

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

        return () => {
            clearInterval(i1);
            clearInterval(i2);
        };
    }, [queueData, albumSwiper, playbackState, paused, APIDelay, APILimit]);

    useEffect(() => {
        if (albumSwiper == null) return;
        SetQueueData(tempQueueData);
        albumSwiper.slideTo(0);
    }, [reloadPlayer, tempQueueData]);

    /*
        Updates the queue to the most recent data from spotify
    */
    async function updateQueue() {
        await GetQueue(localStorage["access"]).then((e) => {
            if (e.kength == 0) {
                SetQueueData([]);
                return;
            }
            let index = -1;
            for (let i = 0; i < queueData.length; i++) {
                if (queueData[i].name == e[0].name) {
                    index = i;
                }
            }
            if (index == -1) {
                if (e.length != 0) {
                    SetQueueData(e);
                }
                return;
            }
            let tempArray = queueData;
            for (let j = 0; j < e.length; j++) {
                tempArray[j + index] = e[j];
            }

            SetQueueData(tempArray);
        });
    }

    function ConvertMilliToTime(time) {
        var ms = time % 1000;
        time = (time - ms) / 1000;
        var secs = time % 60;
        time = (time - secs) / 60;
        var mins = time % 60;
        var hrs = (time - mins) / 60;

        return `${hrs != 0 ? hrs + ":" : ""}${mins}:${("" + secs).length == 1 ? "0" + secs : secs}`;
    }
    /*
        Responsible for calculating the scaling for the carousel to mobile/smaller screen sizes
    */
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
        if (queueData[i] == undefined) return;
        SetCurrentTitle(queueData[i].name);
        SetCurrentArtist(queueData[i].artist);
    }, [queueData, albumSwiper]);
    /*
        Hook responsible for scaling the carousel to mobile/smaller screen sizes
    */
    useEffect(() => {
        calculateArtCount();
    }, [windowWidth, windowHeight]);

    /*
        Hook for all API logic
    */
    useEffect(() => {
        window.addEventListener("resize", () => {
            SetWindowWidth(window.innerWidth);
            SetWindowHeight(window.innerHeight);
        });
        if (localStorage["access"] == undefined || localStorage["refresh"] == undefined) {
            LogIn()
        }
        async function GetData() {
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
    }, []);
    if (!isLoaded) return <></>;

    return (
        <>
            <motion.div className="text-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{}}>
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
                    className="top-[0px] min-w-[250px] h-[100%] overflow-hidden"
                    onSwiper={(e) => {
                        SetAlbumSwiper(e);
                        setCurrentPos(e.activeIndex);
                    }}
                    onSlideChange={(e) => {
                        const i = e.activeIndex;
                        let action;
                        if (e.activeIndex > currentPos) action = "next";
                        else action = "prev";


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
                                        <img className="rounded-lg shadow-lg w-full h-full my-[50px]" src={item.artwork}></img>
                                    </SwiperSlide>
                                );
                            })
                    }
                </Swiper>
                {queueData.length != 0 && (
                    <div className="grid max-cols-1 space-y-3 mt-[20px] h-full w-[40%] mx-[50%] -translate-x-1/2">
                        <>
                            <h1 className="text-nowrap overflow-x-hidden text-[30px]">{currentTitle}</h1>
                            <h1 className="text-nowrap overflow-x-hidden text-[15px]">{currentArtist}</h1>
                            <div className="bg-black dark:bg-gray-500 h-[5px] w-full mt-[10px] rounded-full overflow-hidden">
                                <div style={{ width: `calc(${(100 * playbackState[0]) / playbackState[1]}%)` }} className="bg-gray-500 dark:bg-white h-full"></div>
                            </div>
                            <div className="text-[#808080] flex justify-between">
                                <h1>{ConvertMilliToTime(playbackState[0])}</h1>
                                <h1>{ConvertMilliToTime(playbackState[1])}</h1>
                            </div>
                            <span className="mt-[15px] grid grid-rows-1 grid-cols-3 items-center w-full">
                                <img
                                    className="hover:cursor-pointer dark:invert justify-self-end max-w-[30px] max-h-[30px]"
                                    src="/backward-icon.png"
                                    onClick={() => {
                                        PlayPreviousSong(localStorage["access"]).then((e3) => {
                                            if (e3) {
                                                albumSwiper.slidePrev();
                                                SetIsPaused(false);
                                                setCurrentPos(currentPos - 1);
                                                SetPlaybackState(c=>[0, playbackState[1]])

                                            }
                                        });
                                    }}
                                ></img>
                                {paused ? (
                                    <img
                                        className="hover:cursor-pointer justify-self-center invert dark:invert-0 max-w-[40px] max-h-[40px]"
                                        src="/pause.png"
                                        onClick={() => {
                                            SetIsPaused(!paused);
                                            TogglePlayback(localStorage["access"]).then((v) => SetIsPaused(v));
                                        }}
                                    ></img>
                                ) : (
                                    <img
                                        className="hover:cursor-pointer justify-self-center invert dark:invert-0 max-w-[40px] max-h-[40px]"
                                        src="/play.png"
                                        onClick={() => {
                                            SetIsPaused(!paused);
                                            TogglePlayback(localStorage["access"]).then((v) => SetIsPaused(v));
                                            
                                        }}
                                    ></img>
                                )}
                                <img
                                    className="hover:cursor-pointer dark:invert max-w-[30px] max-h-[30px]"
                                    src="/forward-icon.png"
                                    onClick={() => {
                                        PlayNextSong(localStorage["access"]).then((e2) => {
                                            if (e2) {
                                                updateQueue();
                                                albumSwiper.slideNext();
                                                SetIsPaused(false);
                                                setCurrentPos(currentPos + 1);
                                                SetPlaybackState(c=>[0, playbackState[1]])

                                            }
                                        });
                                    }}
                                ></img>
                            </span>
                        </>
                    </div>
                )}
            </motion.div>
            {windowWidth >= 700 && <PlaylistMenu data={playlistData} SetReloadFlag={SetReloadPlayer} SetNewData={SetTempQueueData}></PlaylistMenu>}
        </>
    );
}
