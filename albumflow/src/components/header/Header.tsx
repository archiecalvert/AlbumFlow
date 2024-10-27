import React from "react";
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    NavbarMenuToggle,
    NavbarMenu, 
    NavbarMenuItem,
    Button
  } from "@nextui-org/react";

  export default function Header()
  {
    return(
        <Navbar isBlurred className = "bg-[#121212] fixed top-0">
            <NavbarBrand className="flex space-x-4">
                <img src="./logo.png" className = "w-12 h-12"></img>
                <h1 className="text-white text-[20px] text-bold">AlbumFlow</h1>
            </NavbarBrand>
            <NavbarItem className="">
                <Button className="bg-[#1DB954] text-bold">Log In</Button>
            </NavbarItem>

        </Navbar>
    )
  }