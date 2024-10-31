import React, {useEffect} from "react"
import Header from "./components/header/Header"
import Footer from "./components/Footer"
import MediaPlayer from "./components/MediaPlayer"
import { ScrollShadow } from "@nextui-org/react"
import DashboardHome from "./components/DashboardHome"
import { GetAccessToken, RequestAuthCode, GetQueueData } from "./components/API"
const code = new URLSearchParams(window.location.search).get("code");
function App()
{
    return(
        <div className = 'h-[100%] bg-[#0C0C0C]'>
            <Header/>
                {!code && <DashboardHome/>}
                {code && <MediaPlayer/>}
            <Footer/>
        </div>
    );
}

export default App