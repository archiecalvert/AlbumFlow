import React, {useState} from "react";
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    NavbarMenuToggle,
    NavbarMenu, 
    NavbarMenuItem,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    Input,
    ModalBody,
    ModalFooter
  } from "@nextui-org/react";
  import LogInModal from "../LogInModal"

  export default function Header()
  {
    const[modalState, toggleModal] = useState(false);
    return(
        <Navbar isBlurred className = "bg-[#121212] fixed top-0">
            <a href="/"><NavbarBrand className="flex space-x-4">
                <img src="./logo.png" className = "w-12 h-12"></img>
                <h1 className="text-white text-[20px] text-bold">AlbumFlow</h1>
            </NavbarBrand></a>
            <NavbarItem className="">
                <Button className="bg-[#1DB954] text-[#000000]" onClick={() => {toggleModal(true)}}>Log In</Button>
                {modalState && <LogInModal modalState={modalState} setModal={toggleModal}/>}
            </NavbarItem>
        </Navbar>
        
    );
  }

