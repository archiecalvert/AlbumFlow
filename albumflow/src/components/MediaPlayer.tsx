import React, { useEffect, useState } from "react";
import { Image, Card, Slider, Spacer, ScrollShadow } from "@nextui-org/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { useAuth } from "./API";

 const MediaPlayer = () =>
{
    useAuth(new URLSearchParams(window.location.search).get("code"))
    let width = window.innerWidth;    
    let itemCount = 0;
    function changeItemCount() {
        console.log("vhangin");
        
        if (width < 500){
            itemCount = 2;
        }
        else if(width < 700)
        {
            itemCount = 3
        }
        else if(width < 900){
            itemCount = 4;
        }
        else{
            itemCount = 5;
        }
        
    };
    changeItemCount();
    window.addEventListener("resize", changeItemCount);
    
    
    return(
        <div className = "top-[150px] bg-transparent h-[60%] w-[100%] min-w-[250px] m-auto float" id="container">
            <div className="w-[100%] h-[600px] min-w-[250px]" id="container">
                <Swiper effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={itemCount}
                    coverflowEffect={{
                    rotate: 15,
                    stretch: 0,
                    depth: 300,
                    modifier: 1,
                    slideShadows: true,
                    }}
                    pagination={false}
                    modules={[EffectCoverflow]}
                    className = "top-[150px] min-w-[250px]">
                    <SwiperSlide>
                        <Image className="w-full h-full b-10px" src="https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO1W5c58-default.jpg" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b273193c2fafdce8f116b5ca0a78" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b2734d070fdf58fad8c54c5beb85" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b27370f7a1b35d5165c85b95a0e0" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://www.billboard.com/wp-content/uploads/2022/03/50.-Taylor-Swift-%E2%80%981989-2014-album-art-billboard-1240.jpg?w=600" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5b2ff13a-8c7d-4f5c-91ee-e23cf39c429e/dgdrfxj-32365f13-0d66-4dde-8f5f-1213d3bf4e83.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzViMmZmMTNhLThjN2QtNGY1Yy05MWVlLWUyM2NmMzljNDI5ZVwvZGdkcmZ4ai0zMjM2NWYxMy0wZDY2LTRkZGUtOGY1Zi0xMjEzZDNiZjRlODMuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.DIIuaoVvec5fo_eQFZ-OXgmNu5N6ToZDNkPUjcVrkbg" isBlurred></Image>
                    </SwiperSlide>
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