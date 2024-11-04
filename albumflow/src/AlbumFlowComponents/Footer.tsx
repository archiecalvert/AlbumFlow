import React from "react";
import {Link} from "@nextui-org/react";
import {Image} from "@nextui-org/react";
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

export default function Footer()
{
    return(
    <div className="w-full bg-transparent fixed bottom-0 flex">
    <Navbar isBlurred={false} className="w-full bg-transparent flex">
        <NavbarBrand>
            <h1 className="text-[#808080] font-semibold">Archie Calvert</h1>
        </NavbarBrand>
        <NavbarItem>
            <span className="space-x-7 text-bold list-none flex m-auto">
                <a href = {window.location.hostname == "netlify.app" ? "https://archiecalvert.netlify.app":"https://archiecalvert.github.io/"} target="_blank"><img src="albumflow/website.png" className="w-6"></img></a>
                <a href = "https://github.com/archiecalvert" target="_blank"><img src = "albumflow/github.png" className="w-6"></img></a>
                <a href = "https://linkedin.com/in/archiecalvert" target="_blank"><img src = "albumflow/linkedin.png" className="w-6"></img></a>
            </span>
        </NavbarItem>
    </Navbar>  
</div>
    );
}