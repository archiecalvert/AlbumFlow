"use client"
import { useState, useEffect } from "react";
export default function Button({children, className, textSize, backgroundColour, textColour, onClick = () => {}})
{
    useEffect(() => {

    }, [])
    return(
        <button onClick={()=>onClick()} className={`${textSize || "text-[15px]"} ${className} ${backgroundColour} ${textColour} transition ease-in-out hover:opacity-[90%] cursor-pointer px-[13.5px] py-[8px] rounded-[12px] font-semibold tracking-tight`}>
            {children}
        </button>
    )
}