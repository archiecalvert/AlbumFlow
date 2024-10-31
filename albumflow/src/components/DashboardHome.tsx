import React, {useState} from "react";
import {Button, modal, toggle} from "@nextui-org/react"
import LogInModal from "./LogInModal";
import { RequestAuthCode } from "./API";


export default function DashboardHome()
{
    const[modalState, toggleModal] = useState(false);
    return(
        
        <div className="w-[100%] min-h-[700px] h-[100% - 65px] block absolute top-[65px] text-center" id="container-dash">
            <div className="top-[100px] relative">
                <h1 className="text-[40px]">Welcome!</h1>
                <h1 className = "text-[20px] mt-[30px] text-neutral-400">This is a project that reimagines the coverflow design for Spotify.</h1>
            </div>
            
            <Button className="bg-[#1DB954] top-[300px] relative flex m-auto" size="lg" onClick={()=>{RequestAuthCode()}}>Log In</Button>
        </div>
    );
}