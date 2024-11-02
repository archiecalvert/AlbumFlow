import React, {useEffect, useState} from "react";
import {
    Navbar, 
    NavbarBrand, 
    NavbarItem, 
    Button,
    Image,
  } from "@nextui-org/react";
import {RequestAuthCode, GetUserDetails} from "./API"
  export default function Header()
  {
    const[modalState, toggleModal] = useState(false);
    const [profilePic, setProfilePic] = useState("");
    const [userName, setUserName] = useState("");
    const [userURL, setUserURL] = useState("");
    const [windowWidth, SetWindowWidth] = useState(window.innerWidth);
    const [windowHeight, SetWindowHeight] = useState(window.innerHeight);
    window.addEventListener("resize", ()=>{SetWindowWidth(window.innerWidth); SetWindowHeight(window.innerHeight);});
    useEffect(() => {
            if(new URLSearchParams(window.location.search).get("code") != null) {
                GetUserDetails().then((res) => {
                    console.log(res);
                    setProfilePic(res.picture_url);
                    setUserName(res.name);
                    setUserURL(res.profile_url);
                })
            }
    }, []);
    

    return(
        <Navbar isBlurred className = "bg-[#121212] fixed top-0">
            <a href="/albumflow"><NavbarBrand className="flex space-x-4">
                <img src="/albumflow/logo.png" className = "w-12 h-12"></img>
                {windowWidth>400 && <h1 className="text-white text-[20px] font-semibold">AlbumFlow</h1>}
            </NavbarBrand></a>
            <NavbarItem className="">
                {!new URLSearchParams(window.location.search).get("code") ? 
                <Button className="bg-[#1DB954] font-semibold text-[#000000]" onClick={() => {RequestAuthCode()}}>Log In</Button>:
                <a href={userURL} target="_blank"><span className="flex align-center">
                    {windowWidth > 400 && <h1 className="font-semibold text-[17px] mt-[7px] mr-[15px]">{userName}</h1>}
                    <Image radius="full"src = {profilePic} className="w-[40px] outline outline-[3px] outline-[#202020]"></Image>
                </span></a>}
            </NavbarItem>
        </Navbar>
        
    );
  }

