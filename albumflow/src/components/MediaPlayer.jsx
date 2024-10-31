import React, { useEffect, useState, useRef } from "react";
import { Button, Image, Card, CardHeader, CardBody, Slider, Spacer, ScrollShadow } from "@nextui-org/react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { PlayNext, GetQueueData, GetAccessToken, GetCurrentSong, PlayPrev, PausePlayback } from "./API";

function MediaPlayer()
{
    const [QueueData, SetQueueData] = useState([]);
    const [AuthCode, SetAuthCode] = useState(null);
    const [AccessToken, SetAccessToken] = useState(null);
    const [RefreshToken, SetRefreshToken] = useState(null);
    const [CurrentSong, SetCurrentSong] = useState(null);
    const [CurrentItem, SetCurrentItem] = useState(0);
    const [PlaybackState, SetPlaybackState] = useState(false);
    let key = 0;
    let ItemCount = changeItemCount();
    //Effectively the constructor
    useEffect(() => {
        SetAuthCode(new URLSearchParams(window.location.search).get("code"));
        GetAccessToken(new URLSearchParams(window.location.search).get("code")).then((response) => {
            ReloadData();
        });
        
    }, []);
    
    function changeItemCount(){
        let width = window.innerWidth;        
        if (width < 500){
            return 2;
        }
        else if(width < 700)
        {
            return 3;
        }
        else if(width < 900){
            return 4;
        }
        else{
            return 5;
        }
    }
    window.addEventListener("resize", ()=>{key += 1});
    useEffect(() => {
        ItemCount = changeItemCount();
    }, [key])
    return(
        
        <div className = "top-[150px] bg-transparent h-[60%] w-[100%] min-w-[250px] m-auto flex flex-wrap" id="container">
            <div className="w-[100%] h-[600px] min-w-[250px]" id="container">
                <Swiper key={CurrentItem} effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={ItemCount}
                    coverflowEffect={{
                    rotate: 15,
                    stretch: 0,
                    depth: 300,
                    modifier: 1,
                    slideShadows: false,
                    }}
                    pagination={false}
                    modules={[EffectCoverflow, Navigation]}
                    className = "top-[150px] min-w-[250px]">
                    {QueueData.map((item, index) =>{
                        if(item.artworkURL == null)
                        {
                            return(
                                <SwiperSlide key={index}>
                                    <Card className="w-full h-full aspect-square bg-[#1DB954] outline-[5px] outline-[#137C38] my-[50px]" isBlurred>
                                        <CardBody className = "w-full h-full justify-center text-center">
                                            <h1 className="text-[40px]"><b>Queue Empty</b></h1>
                                            <h1 className="mt-[15px]">Please start playing some songs!</h1>
                                        </CardBody>
                                    </Card>
                                </SwiperSlide>
                            );
                        }
                        return(
                            
                            <SwiperSlide key={index}>
                                <Image className="w-full h-full my-[50px]" src={item.artworkURL} isBlurred></Image>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
            {CurrentSong && CurrentSong.name != null &&
                <div className="w-[75%] max-w-[550px] h-[200px] m-auto" id = "media-controls-container">
                    <Card className="bg-[#202020] w-full h-full outline-[4px] outline-[#191919]" isBlurred={true}>
                        <h1 className="text-white flex relative mx-auto top-[20px] text-[20px] max-w-[90%]"><b>{CurrentSong && CurrentSong.name}{!CurrentSong && "Loading.."}</b></h1>
                        <h1 className="text-neutral-500 max-w-[75%] flex relative mx-auto top-[30px]">{CurrentSong && CurrentSong.artist}{!CurrentSong && "Loading.."}</h1>
                        <Slider className="w-[90%] h-[10px] top-[50px] relative flex mx-auto" hideThumb size="sm" color="success"></Slider>
                        <div className = "absolute bottom-[20px] w-[100%]">
                            <span className="w-[40%] min-w-[150px] h-[40px] flex relative justify-between m-auto align-center">
                            <Image radius="none" src = "mediacontrols/light/prev.png" className="w-[30px] relative" onClick={()=>{PlayPrev().then(()=>{ReloadData()})}}/>
                            <Image disableSkeleton radius="none" src = {localStorage["isPlaying"]=="true" ? "mediacontrols/light/pause.png" : "mediacontrols/light/play.png"} className="w-[40px]" onClick={()=>{PausePlayback().then(()=>{ReloadData()})}} />
                            <Image radius = "none" src = "mediacontrols/light/skip.png" className=" w-[30px] relative" onClick={()=>{console.log(PlayNext().then(()=>{ReloadData()}))}}/>
                            </span>
                        </div>
                    </Card>
                    
                </div>
            }
        </div>
    );
    function ReloadData()
    {
        console.log("Reloading Data");
        GetQueueData(localStorage["access_token"]).then((data) => {
            SetQueueData(data);
            GetCurrentSong().then((song) => {
                SetCurrentSong(song);
            });
        });
    }
}


export default MediaPlayer