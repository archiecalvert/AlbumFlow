import React from "react"
import Header from "./components/header/Header"
import Footer from "./components/Footer"
import MediaPlayer from "./components/MediaPlayer"
import { ScrollShadow } from "@nextui-org/react"
const App = () =>
{
    return(
        <div className = 'h-screen bg-[#0C0C0C]'>
            <Header></Header>
                    <MediaPlayer />
            <Footer></Footer>
            
        </div>
    )
}

export default App