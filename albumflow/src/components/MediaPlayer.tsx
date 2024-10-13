import React from "react";
import { Image, Card, Slider, Spacer, ScrollShadow } from "@nextui-org/react";
export default function MediaPlayer()
{
    return(
        <div className="flex absolute top-[150px] w-full h-[60%]" id="container">
            <div className="float justify-center relative w-full h-full">
                <div className="max-w-[350px] min-w-[250px] w-[15%] aspect-square m-auto" id="image-container">
                    <Image className="w-full h-full"
                            src="https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO1W5c58-default.jpg"
                            isBlurred></Image>
                </div>
                <Spacer y={24}></Spacer>
                <div className="w-[75%] max-w-[550px] h-[200px] m-auto" id = "media-controls-container">
                    
                    <Card className="bg-[#202020] w-full h-full outline-10">
                        <h1 className="text-white flex relative mx-auto top-[20px] text-[20px]"><b>This is Clairo</b></h1>
                        <h1 className="text-neutral-500 max-w-[75%] flex relative mx-auto top-[30px]">Clairo</h1>
                        <Slider className="w-[90%] h-[10px] top-[50px] relative flex mx-auto" hideThumb size="sm" color="success"></Slider>
                    </Card>
                </div>
            <div>
            </div>
            </div>
        </div>
    );
}