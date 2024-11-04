import { Navbar, NavbarBrand, Image, NavbarContent, NavbarItem, Button, DropdownMenu, Dropdown, DropdownTrigger, DropdownItem } from "@nextui-org/react";
import {useState} from "react";
function Header()
{
    const [windowWidth, setWinWidth] = useState(window.innerWidth);
    const [windowHeight, setWinHeight] = useState(window.innerHeight);
    window.addEventListener("resize", () => {setWinWidth(window.innerWidth); setWinHeight(window.innerHeight);});
    return(
        <Navbar position="static" className = "bg-transparent justify-center flex">
            <NavbarBrand>
                <Image alt="/main/iconlarge.png" isBlurred radius = "full" className = "outline outline-white outline-1 w-10 mr-[15px]" src="/main/iconlarge.png"/>
                <h1 className="font-semibold text-[20px] text-white">Archie Calvert</h1>
            </NavbarBrand>
            {windowWidth > 450 && <NavbarItem className="mr-5">
                    <span className="flex align-center">
                        <a target="_blank" href="https://www.linkedin.com/in/archiecalvert/"><img className="w-7"src = "/main/linkedin.png"></img></a>
                        <a target="_blank" href="https://github.com/archiecalvert"><img className="ml-5 w-7"src = "/main/github.png"></img></a>
                    </span>
            </NavbarItem>}
            <NavbarItem>
                <Dropdown className="bg-[#202020] mr-[15px]">
                    <DropdownTrigger>
                        <Button className="bg-white text-black font-semibold">Projects</Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem color="" className="hover:bg-[#505050]">
                            <a href="/albumflow">
                            <span className="flex items-center">
                                <img src = "/albumflow/logo.png" className = "w-7 h-7 mr-[10px]"/>
                                <h1 className="font-semibold text-[15px]">AlbumFlow</h1>
                            </span></a>
                        </DropdownItem>
                        <DropdownItem color="" className="hover:bg-[#505050]">
                            <a href="https://github.com/archiecalvert/Game-Creation-Toolkit">
                                <span className="flex items-center h-7">
                                    <img src = "/main/github.png" className = "w-7 h-7 mr-[10px] p-[2px]"/>
                                    <h1 className = "font-semibold text-[15px]">Game Creation Toolkit</h1>
                                </span>
                            </a>
                        </DropdownItem>
                        <DropdownItem color="" className="hover:bg-[#505050]">
                            <a href="https://github.com/archiecalvert/Smart-Mirror">
                                <span className="flex items-center h-7">
                                <img src = "/main/github.png" className = "w-7 h-7 mr-[10px] p-[2px]"/>
                                <h1 className = "font-semibold text-[15px]">Smart Mirror</h1>
                                </span>
                            </a>
                        </DropdownItem>
                        <DropdownItem color="" className="hover:bg-[#505050]">
                            <a href="https://github.com/archiecalvert/DungeonGame">
                                <span className="flex items-center h-7">
                                <img src = "/main/github.png" className = "w-7 h-7 mr-[10px] p-[2px]"/>
                                <h1 className = "font-semibold text-[15px]">Dungeon Game</h1>
                                </span>
                            </a>
                        </DropdownItem>
                        <DropdownItem color="" className="hover:bg-[#505050]">
                            <a href="https://github.com/archiecalvert/2D-Platformer">
                                <span className="flex items-center h-7">
                                <img src = "/main/github.png" className = "w-7 h-7 mr-[10px] p-[2px]"/>
                                <h1 className = "font-semibold text-[15px]">2D Platformer Demo</h1>
                                </span>
                            </a>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarItem>
        </Navbar>
    );
}

export default Header;