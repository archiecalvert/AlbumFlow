import "./style.css";
import { CustomButton } from "../CustomButton/CustomButton";
import logo from ".../assets/logo.png";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
function Header()
{
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    return(
        <div>
            <div className = "header-container">
                <div className="title">
                    <img src="./images/logo.png" id="icon"></img>
                    <h1 id = "name">AlbumFlow</h1>
                </div>
                <div className="controls">
                    
                    <CustomButton color="green" onPress={onOpen}>API Key</CustomButton>
                    <Modal 
                        isOpen={isOpen} 
                        onOpenChange={onOpenChange}
                        placement="center"
                        backdrop="blur"
                    >
                        <ModalContent>
                        {(onClose) => (
                            <>
                            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                            <ModalBody>
                                <Input
                                autoFocus
                                label="Client ID"
                                placeholder="Enter your Client ID"
                                variant="bordered"
                                />
                                <Input
                                label="Client Secret"
                                placeholder="Enter your Client Secret"
                                variant="bordered"
                                />
                                <div className="flex py-2 px-1 justify-between">
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" onPress={onClose}>
                                Close
                                </Button>
                                <CustomButton color="green" onPress={onClose}>
                                Sign in
                                </CustomButton>
                            </ModalFooter>
                            </>
                        )}
                        </ModalContent>
                    </Modal>

                        
                </div>
            </div>
        </div>
    );
}
export default Header