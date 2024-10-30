import React, { useEffect, useState } from "react";
import { Image, Card, CardHeader, CardBody, Slider, Spacer, ScrollShadow } from "@nextui-org/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { GetQueueData, GetAccessToken } from "./API";

function MediaPlayer()
{
    const [QueueData, SetQueueData] = useState([]);
    const [AuthCode, SetAuthCode] = useState(null);
    const [AccessToken, SetAccessToken] = useState(null);
    const [RefreshToken, SetRefreshToken] = useState(null);
    let key = 0;
    let ItemCount = changeItemCount();
    useEffect(() => {
        SetAuthCode(new URLSearchParams(window.location.search).get("code"));
        GetAccessToken(new URLSearchParams(window.location.search).get("code")).then((response) => {
            SetAccessToken(response.data.access_token);
            SetRefreshToken(response.data.refresh_token);
            GetQueueData(localStorage["access_token"]).then((data) => {
            SetQueueData(data);
            console.log(data)
            });
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
        
        <div className = "top-[150px] bg-transparent h-[60%] w-[100%] min-w-[250px] m-auto float" id="container">
            {console.log("renderer")}
            <div className="w-[100%] h-[600px] min-w-[250px]" id="container">
                <Swiper key={ItemCount} effect={'coverflow'}
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
                    modules={[EffectCoverflow]}
                    className = "top-[150px] min-w-[250px]">
                    {QueueData.map((item, index) =>{
                        if(item.artworkURL == null)
                        {
                            console.log("No Artwork");
                            return(
                                <SwiperSlide key={index}>
                                    <Card className="w-full aspect-square bg-[#1DB954]" isBlurred>
                                        <CardBody className = "w-full h-full justify-center text-center">
                                            <h1 className="text-[40px]">Queue Empty</h1>
                                            <h1 className="mt-[15px]">Please start playing some songs!</h1>
                                        </CardBody>
                                    </Card>
                                </SwiperSlide>
                            );
                        }
                        console.log("Artwork Found");
                        return(
                            
                            <SwiperSlide key={index}>
                                <Image className="w-full h-full" src={item.artworkURL}></Image>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
            
                <div className="w-[75%] max-w-[550px] h-[200px] m-auto flex" id = "media-controls-container">
                    
                    <Card className="bg-[#202020] w-full h-full outline-10">
                        <h1 className="text-white flex relative mx-auto top-[20px] text-[20px]"><b>[SONG NAME]</b></h1>
                        <h1 className="text-neutral-500 max-w-[75%] flex relative mx-auto top-[30px]">[ARTIST NAME]</h1>
                        <Slider className="w-[90%] h-[10px] top-[50px] relative flex mx-auto" hideThumb size="sm" color="success"></Slider>
                    </Card>
                </div>
        </div>
    );
}

export default MediaPlayer