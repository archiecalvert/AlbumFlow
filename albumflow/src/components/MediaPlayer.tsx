import React from "react";
import { Image, Card, Slider, Spacer, ScrollShadow } from "@nextui-org/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
export default function MediaPlayer()
{

    let width = window.innerWidth;
    console.log(width);
    
    let itemCount = 0;
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
    return(
        <div className = "top-[150px] bg-transparent h-[60%] w-[100%] min-w-[250px] m-auto float" id="container">
            <div className="w-[100%] h-[100%] min-w-[250px]" id="container">
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
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b273193c2fafdce8f116b5ca0a78" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b2734d070fdf58fad8c54c5beb85" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b273193c2fafdce8f116b5ca0a78" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b2734d070fdf58fad8c54c5beb85" isBlurred></Image>
                    </SwiperSlide>
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
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b273193c2fafdce8f116b5ca0a78" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b2734d070fdf58fad8c54c5beb85" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b273193c2fafdce8f116b5ca0a78" isBlurred></Image>
                    </SwiperSlide>
                    <SwiperSlide>
                        <Image className="w-full h-full" src="https://i.scdn.co/image/ab67616d0000b2734d070fdf58fad8c54c5beb85" isBlurred></Image>
                    </SwiperSlide>
                </Swiper>
            </div>
            
                <div className="w-[75%] max-w-[550px] h-[200px] m-auto justify-self" id = "media-controls-container">
                    
                    <Card className="bg-[#202020] w-full h-full outline-10">
                        <h1 className="text-white flex relative mx-auto top-[20px] text-[20px]"><b>This is Clairo</b></h1>
                        <h1 className="text-neutral-500 max-w-[75%] flex relative mx-auto top-[30px]">Clairo</h1>
                        <Slider className="w-[90%] h-[10px] top-[50px] relative flex mx-auto" hideThumb size="sm" color="success"></Slider>
                    </Card>
                </div>
        </div>
    );
}