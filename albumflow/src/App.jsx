import React, {useState} from "react"
import {Route, Routes} from "react-router-dom"
import AlbumFlow from "./AlbumFlowComponents/AlbumFlow"
import BaseMainHomePage from "./Home/BaseHomePage"
const code = new URLSearchParams(window.location.search).get("code");

function App()
{

    return(
        <Routes>
            <Route path="/albumflow" element={<AlbumFlow/>}/>
            <Route path="/" element={<BaseMainHomePage/>}/>
        </Routes>
    );
}

export default App