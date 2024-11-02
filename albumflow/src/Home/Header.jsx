import { Navbar, NavbarBrand, Image, NavbarContent, NavbarItem, Button, DropdownMenu, Dropdown, DropdownTrigger, DropdownItem } from "@nextui-org/react";
import {useState} from "react";
function Header()
{
    const [windowWidth, setWinWidth] = useState(window.innerWidth);
    const [windowHeight, setWinHeight] = useState(window.innerHeight);
    window.addEventListener("resize", () => {setWinWidth(window.innerWidth); setWinHeight(window.innerHeight);});
    return(
        <Navbar className = "bg-transparent justify-center flex">
            <NavbarBrand>
                <Image isBlurred radius = "full" className = "outline outline-white outline-1 w-10 mr-[10px]" src="https://avatars.githubusercontent.com/u/143741961?v=4" alt="/albumflow/profilepic.jpg" />
                <h1 className="font-semibold text-[20px] text-white">Archie Calvert</h1>
            </NavbarBrand>
            {windowWidth > 450 && <NavbarItem className="mr-5">
                    <span className="flex align-center">
                        <a target="_blank" href="https://www.linkedin.com/in/archiecalvert/"><img className="w-7"src = "/main/linkedin.png"></img></a>
                        <a target="_blank" href="https://github.com/archiecalvert"><img className="ml-5 w-7"src = "/main/github.png"></img></a>
                    </span>
            </NavbarItem>}
            <NavbarItem>
                <Dropdown className="bg-[#202020]">
                    <DropdownTrigger>
                        <Button className="bg-white text-black font-semibold">Projects</Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem color="" className="hover:bg-[#505050]">
                            <a href="/albumflow">
                            <span className="flex items-center">
                                <img src = "/albumflow/logo.png" className = "w-7 mr-[10px]"/>
                                <h1 className="font-semibold text-[15px]">AlbumFlow</h1>
                            </span></a>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarItem>
        </Navbar>
    );
}

export default Header;