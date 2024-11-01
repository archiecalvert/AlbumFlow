import React, { useEffect, useState, useRef } from "react";
import { Button, Image, Card, CardHeader, CardBody, Slider, Spacer, ScrollShadow } from "@nextui-org/react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import {GetCurrentSongDetails, PlayNext, GetQueueData, GetAccessToken, GetCurrentSong, PlayPrev, PausePlayback } from "./API";

let next = false;
let prev = false;
function MediaPlayer()
{
    //React hooks
    const [QueueData, SetQueueData] = useState([]);
    const [AuthCode, SetAuthCode] = useState(null);
    const [AccessToken, SetAccessToken] = useState(null);
    const [RefreshToken, SetRefreshToken] = useState(null);
    const [CurrentSong, SetCurrentSong] = useState(null);
    const [CurrentItem, SetCurrentItem] = useState(0);
    const [PlaybackState, SetPlaybackState] = useState(false);
    const [windowWidth, SetWindowWidth] = useState(window.innerWidth);
    const [windowHeight, SetWindowHeight] = useState(window.innerHeight);
    const [QueuePosition, SetQueuePosition] = useState(0);
    let ItemCount = changeItemCount();

    //Manages window resizing for elements
    window.addEventListener("resize", ()=>{SetWindowWidth(window.innerWidth); SetWindowHeight(window.innerHeight);});
    //Loads data from API when the page fully loads
    useEffect(() => {
        SetAuthCode(new URLSearchParams(window.location.search).get("code"));
        GetAccessToken(new URLSearchParams(window.location.search).get("code")).then((response) => {
            ReloadData();
        });
        
    }, []);
    //Used to calculate how many albums are placed on the screen
    function changeItemCount(){
        let width = window.innerWidth;
        if (width < 700){
            return 2;
        }
        else if(width < 900)
        {
            return 3;
        }
        else if(width < 1100){
            return 4;
        }
        else{
            return 5;
        }
    }
    return(
        <div className = "absolute top-[15%] bg-transparent w-[100%] min-w-[250px] m-auto flex flex-wrap" id="container">
            <div className="w-[100%] min-w-[250px]" id="container-inner">
                <Swiper key={CurrentItem} effect={'coverflow'} id="swiper"
                    cssMode={false}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={ItemCount}
                    coverflowEffect={{
                    rotate: 15,
                    stretch: 0,
                    depth: 270,
                    modifier: 1,
                    slideShadows: false,
                    }}
                    pagination={false}
                    modules={[EffectCoverflow, Navigation]}
                    className = "top-[0px] min-w-[250px] h-[100%] overflow-visible">
                        
                    {QueueData.map((item, index) =>{
                        //Adds all the items in the queue to the swiper
                        if(item.artworkURL == null)
                        {
                            //if the queue is empty...
                            return(
                                <SwiperSlide key={index}>
                                    <Card className="w-full aspect-square bg-[#1DB954] outline-[5px] outline-[#137C38] my-[50px]" isBlurred>
                                        <CardBody className = "w-full h-full justify-center text-center">
                                            <h1 className="text-[40px] mx-[10px] leading-[50px]"><b>Queue Empty</b></h1>
                                            <h1 className="mt-[15px] font-semibold mx-[10px]">Please start playing some songs!</h1>
                                        </CardBody>
                                    </Card>
                                </SwiperSlide>
                            );
                        }
                        return(
                            //if the queue is not empty...
                            <SwiperSlide key={index}>
                                <Image className="w-full h-full my-[50px]" src={item.artworkURL} isBlurred></Image>
                            </SwiperSlide>
                        );
                    })}
                    <MediaControls></MediaControls>
                </Swiper>
            </div>

        </div>
    );
    function ReloadData()
    {
        //Loads API data
        GetQueueData().then((data) => {
            SetQueueData(data);
            GetCurrentlyPlayingSong().then((song) => {
                SetCurrentSong(song);
                SetPlaybackState(song.is_playing);
                
            });
        });
    }
    function GetCurrentlyPlayingSong(){
        GetCurrentSongDetails().then((song) => {
            SetCurrentSong(song);
            SetPlaybackState(!song.is_playing);
        });
    }
    function AddToQueue()
    {
        console.log(QueueData);
        let currentData = QueueData;
        GetQueueData().then((data) => {
            for(let i = 0; i < data.length; i++)
            {
                let inQueue = false;
                for(let j = 0; j < currentData.length; j++)
                {
                    console.log(currentData[j].id + " " + data[i].id);
                    if(data[i].name == currentData[j].name)
                    {
                        inQueue = true;
                        j=currentData.length - 1;
                    }
                }
                if(!inQueue) currentData.push(data[i]);
            }
            SetQueueData(currentData);
        })
    }
    function MediaControls(){
        const swiper = useSwiper();
        return(
        CurrentSong && CurrentSong.name != null && (windowWidth > windowHeight ?
            //LANDSCAPE MODE MUSIC CONTROLS
                <div className="mt-[-100px] w-[75%] max-w-[550px] h-[200px] m-auto" id = "media-controls-container">
                    <Card className="bg-[#202020] w-[100%] h-[100%] outline-[4px] outline-[#191919]" isBlurred={true}>
                        <h1 className="text-white flex relative mx-auto top-[20px] text-[20px] max-w-[90%]"><b>{CurrentSong && QueueData[QueuePosition].name}{!CurrentSong && "Loading.."}</b></h1>
                        <h1 className="text-neutral-500 max-w-[75%] flex relative mx-auto top-[30px]">{CurrentSong && QueueData[QueuePosition].artist}{!CurrentSong && "Loading.."}</h1>
                        <Slider className= "w-[90%] h-[10px] top-[50px] relative flex mx-auto" hideThumb size="sm" color="success"></Slider>
                        <div className = "absolute bottom-[20px] w-[100%]">
                            <span className="w-[40%] min-w-[150px] h-[40px] flex relative justify-between m-auto align-center">
                            <Image radius="none" src = "mediacontrols/light/prev.png" className="w-[30px] relative" onClick={()=>{PlayPrev().then(()=>{swiper.slidePrev(); SetPlaybackState(true); SetQueuePosition(QueuePosition - 1)})}}/>
                            <Image disableSkeleton radius="none" alt="mediacontrols/light/pause.png" src = {PlaybackState==true ? "mediacontrols/light/pause.png" : "mediacontrols/light/play.png"} className="w-[40px] mt-[-2px]" onClick={()=>{PausePlayback().then(()=>{SetPlaybackState(!PlaybackState); GetCurrentlyPlayingSong();})}} />
                            <Image radius = "none" src = "mediacontrols/light/skip.png" id="skip" className="w-[30px] relative" onClick={()=>{console.log(PlayNext().then(()=>{swiper.slideNext(); SetPlaybackState(true); SetQueuePosition(QueuePosition + 1); AddToQueue()}))}}/>
                            </span>
                        </div>
                    </Card>
                    
                </div>
            //PORTRAIT MODE MUSIC CONTROLS
            :<div className= "mt-[-75px] w-[75%] max-w-[550px] h-[165px] m-auto" id = "media-controls-container">
            <Card className="bg-[#202020] w-[100%] h-[100%] outline-[4px] outline-[#191919]" isBlurred={true}>
                <h1 className="text-white flex relative mx-auto text-center top-[15px] text-[20px] max-w-[90%]"><b>{CurrentSong && QueueData[QueuePosition].name}{!CurrentSong && "Loading.."}</b></h1>
                <h1 className="text-neutral-500 max-w-[75%] flex relative mx-auto top-[20px]">{CurrentSong && QueueData[QueuePosition].artist}{!CurrentSong && "Loading.."}</h1>
                <Slider className= "w-[90%] h-[10px] top-[27px] relative flex mx-auto" hideThumb size="sm" color="success"></Slider>
                <div className = "absolute bottom-[15px] w-[100%]">
                    <span className="w-[40%] min-w-[150px] h-[40px] flex relative justify-between m-auto align-center">
                    <Image radius="none" src = "mediacontrols/light/prev.png" className="w-[25px] mt-[5px] relative" onClick={()=>{PlayPrev().then(()=>{swiper.slidePrev(); SetPlaybackState(true); SetQueuePosition(QueuePosition - 1)})}}/>
                    <Image disableSkeleton radius="none" alt="mediacontrols/light/pause.png" src = {PlaybackState==true ? "mediacontrols/light/pause.png" : "mediacontrols/light/play.png"} className="w-[35px]" onClick={()=>{PausePlayback().then(()=>{GetCurrentlyPlayingSong(); SetPlaybackState(!PlaybackState)})}} />
                    <Image radius = "none" src = "mediacontrols/light/skip.png" id="skip" className="w-[25px] mt-[5px] relative" onClick={()=>{PlayPrev().then(()=>{swiper.slidePrev(); SetPlaybackState(true); SetQueuePosition(QueuePosition + 1)})}}/>
                    </span>
                </div>
            </Card>
        </div>
        ))
    }
}


export default MediaPlayer

