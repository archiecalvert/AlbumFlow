import React from "react";
import { Image, Card } from "@nextui-org/react";
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
                <div className="w-full h-[10%] flex"></div>
                
                <div className="w-[75%] max-w-[550px] h-[150px] m-auto outline-10" id = "media-controls-container">
                    <Card className="bg-[#202020] w-full h-full outline-10"></Card>
                </div>
            <div>
            </div>
            </div>
        </div>
    );
}