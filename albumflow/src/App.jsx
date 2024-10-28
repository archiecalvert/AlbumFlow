import React from "react"
import Header from "./components/header/Header"
import Footer from "./components/Footer"
import MediaPlayer from "./components/MediaPlayer"
import { ScrollShadow } from "@nextui-org/react"
import DashboardHome from "./components/DashboardHome"

const code = new URLSearchParams(window.location.search).get("code");
const App = () =>
{
    return(
        <div className = 'h-screen bg-[#0C0C0C]'>
            <Header/>
                {!code && <DashboardHome/>}
                {code && <MediaPlayer />}
            <Footer></Footer>
        </div>
    );
}

export default App