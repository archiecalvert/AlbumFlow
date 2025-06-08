"use client";
import { LogIn } from "@/api/auth";
import Button from "@/components/button";

import { motion } from "motion/react"
import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const DummyArt = [
    "https://i.scdn.co/image/ab67616d0000b2730d545f68474bf0dbf975aa94",
    "https://i.scdn.co/image/ab67616d0000b27395c46b8fc115329971316b30",
    "https://i.scdn.co/image/ab67616d0000b273bef2aa727d01632bdf007cda",
    "https://i.scdn.co/image/ab67616d0000b273ddc1c0f1d03d97912bfb6a18",
    "https://i.scdn.co/image/ab67616d0000b2731b4b7ca351f1175a1cefbe82",
    "https://i.scdn.co/image/ab67616d0000b2730d545f68474bf0dbf975aa94",
    "https://i.scdn.co/image/ab67616d0000b273f95a4927ff9ba6f64c41d226",
    "https://i.scdn.co/image/ab67616d0000b273c20ad7bbceac96755d854565",
    "https://i.scdn.co/image/ab67616d0000b273f95a4927ff9ba6f64c41d226",
    "https://i.scdn.co/image/ab67616d0000b273254dc4ddb427fe8d50a99ab2",
    "https://i.scdn.co/image/ab67616d0000b273c20ad7bbceac96755d854565",
    "https://i.scdn.co/image/ab67616d0000b27383fa2caabd0030bf77df9fb1",
    "https://i.scdn.co/image/ab67616d0000b273c20ad7bbceac96755d854565",
    "https://i.scdn.co/image/ab67616d0000b27395c46b8fc115329971316b30",
    "https://i.scdn.co/image/ab67616d0000b273efdc8e49b201b16cb967e12a",
    "https://i.scdn.co/image/ab67616d0000b2738e23c0035f6c2b671f3db15c",
    "https://i.scdn.co/image/ab67616d0000b273bef2aa727d01632bdf007cda",
    "https://i.scdn.co/image/ab67616d0000b273c3db8e1ced078d962d202c6e",
    "https://i.scdn.co/image/ab67616d0000b273efdc8e49b201b16cb967e12a",
    "https://i.scdn.co/image/ab67616d0000b273b106371d3cb114f3c67d7cd0",
]
export default function Home() {
    
    const [artCount, SetArtCount] = useState(null);
    const [windowWidth, SetWindowWidth] = useState(window.innerWidth);
    const [windowHeight, SetWindowHeight] = useState(window.innerHeight);

    function calculateArtCount(){
        if(windowWidth < 700) SetArtCount(2);
        else if(windowWidth < 900) SetArtCount(3);
        else if(windowWidth < 1100) SetArtCount(4);
        else SetArtCount(5);
    }

    useEffect(()=>{window.addEventListener("resize", ()=>{SetWindowWidth(window.innerWidth); SetWindowHeight(window.innerHeight);});}, [])
    useEffect(()=>{
        calculateArtCount()
    }, [windowWidth, windowHeight])
    return (
        <>
            <div className="page-content justify-center w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{}}>
                    <Swiper effect={'coverflow'} id="swiper"
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
                        className="overflow-hidden"
                        enabled={false}
                        speed={30}
                        onSwiper={(e)=>{
                            
                            e.activeIndex=10;
                        }}
                        onAfterInit={()=>{calculateArtCount()}}
                    >
                    {
                        // Adds all the album artwork to the carousel
                    DummyArt.map((item, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <img className="rounded-lg shadow-lg my-[50px]" src={item}></img>
                            </SwiperSlide>
                        );
                    })}
                    </Swiper>
                 </motion.div>
                <div className="grid justify-items-center space-y-3 max-cols-1 mb-[150px]">
                    <h1 className="font-semibold mx-auto text-[55px]">AlbumFlow</h1>
                    <Button onClick={LogIn} className="" backgroundColour="bg-[#1D1D1F] dark:bg-white" textColour="text-white dark:text-black">Sign In</Button>
                </div>
            </div>
        </>
    );
}
