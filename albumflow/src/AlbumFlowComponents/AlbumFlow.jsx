import React, {useState} from "react"
import Header from "./Header"
import Footer from "./Footer"
import MediaPlayer from "./MediaPlayer"
import DashboardHome from "./DashboardHome"
const code = new URLSearchParams(window.location.search).get("code");

function AlbumFlow()
{
    const [windowWidth, SetWindowWidth] = useState(window.innerWidth);
    const [windowHeight, SetWindowHeight] = useState(window.innerHeight);
    window.addEventListener("resize", ()=>{SetWindowWidth(window.innerWidth); SetWindowHeight(window.innerHeight);});
    return(
        <div className = 'w-[100%] bg-[#0C0C0C] overflow-hidden'>
            <Header/>
                {!code && <DashboardHome/>}
                {code && <MediaPlayer/>}
            {windowWidth>400 && <Footer/>}
        </div>
    );
}

export default AlbumFlow