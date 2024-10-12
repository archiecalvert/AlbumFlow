import React from "react";
import {Link} from "@nextui-org/react";
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
    <div className="w-full bg-transparent absolute bottom-0 flex">
    <Navbar className="w-full bg-transparent flex">
        <NavbarBrand>
            <h1 className="text-[#808080] text-bold">Archie Calvert</h1>
        </NavbarBrand>
        <NavbarItem>
            <span className="space-x-7 text-bold list-none">
                <Link className="text-[#1DB954]" href="https://github.com/archiecalvert">GitHub</Link>
                <Link className="text-[#1DB954]" href="https://linkedin.com/in/archiecalvert">LinkedIn</Link>
            </span>
        </NavbarItem>
    </Navbar>  
</div>
    );
}

function OLDCODE()
{
    <div className="w-full h-7 bg-transparent absolute bottom-0 flex ps-20 pe-20">
    <div className="w-full h-full bg-red justify-between flex">
        <h1 className="text-[#808080] text-bold">Archie Calvert</h1>
        <li className="space-x-7 text-bold list-none">
            <Link className="text-[#1DB954]" href="https://github.com/archiecalvert">GitHub</Link>
            <Link className="text-[#1DB954]" href="https://linkedin.com/in/archiecalvert">LinkedIn</Link>
        </li>
    </div>
</div>
}