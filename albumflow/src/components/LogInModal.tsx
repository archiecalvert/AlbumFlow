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
  import {RequestAuthCode} from "./API"

export default function LogInModal({modalState, setModal})
  {
    const [clientIDVal, changeID] = React.useState("");
    const [clientSecVal, changeSec] = React.useState("");
    const [uriVal, changeURI] = React.useState("");
    return(
        <Modal isOpen={modalState} placement="center" hideCloseButton = {true} shadow="lg" backdrop="blur" disableAnimation={false} className="outline outline-2 outline-[#303030]">
            <ModalContent className="bg-[#1C1C1C] ">
                <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
                <ModalBody>
                    <Input
                        label="Client ID"
                        placeholder=""
                        variant="bordered"
                        id="client_id_input"
                        value={clientIDVal}
                        onValueChange={changeID}
                    />
                    <Input
                        label="Client Secret"
                        placeholder=""
                        variant="bordered"
                        id = "client_secret_input"
                        value={clientSecVal}
                        onValueChange={changeSec}
                    />
                    <Input
                        label="Redirect URI"
                        placeholder=""
                        variant="bordered"
                        id="redirect_uri_input"
                        value={uriVal}
                        onValueChange={changeURI}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button className="bg-[#303030] text-white"variant="flat" onClick={()=>{setModal(false)}}>
                    Close
                    </Button>
                    <Button className="bg-[#1DB954]" onClick={()=>{RequestAuthCode();}}>
                    Log in
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
  }