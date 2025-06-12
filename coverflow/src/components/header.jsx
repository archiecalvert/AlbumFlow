"use client"
import { useEffect, useState } from "react";

export default function Header()
{
    // Used to invert the colour of the text
    const [invert, SetInvert] = useState(false)
    useEffect(()=>{
        SetInvert(window.location.pathname == "/player")
    }, [])

    return(
        <>
            <div className="h-[50px] w-full flex justify-center">
                <span className={`${invert && "invert"} text-shadow-[100px] content my-auto w-[80%]`}>
                    <h1>AlbumFlow</h1>
                </span>
            </div>
        </>
    );
}