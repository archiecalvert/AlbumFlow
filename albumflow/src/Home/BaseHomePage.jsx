import { Image, Card, CardHeader, CardBody, Button, ButtonGroup, Pagination, Tab, Tabs} from "@nextui-org/react";
import Header from "./Header"
import {motion, useScroll} from "framer-motion";
import React, { useState, useEffect} from "react";
export default function BaseMainHomePage()
{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const {ContentRef} = React.useRef();
    const {scrollYProgress} = useScroll(
        {
            target: ContentRef,
        }
    );
    useEffect(() => {
        window.addEventListener("resize", ()=>{setWindowWidth(window.innerWidth); console.log("f")});
    }, []);
    
    return(
        <div>
            <Header></Header>
            <motion.div ref={ContentRef} className="h-[1000vh] mt-[50px] mx-[10%]"
            initial={{
                opacity: 0}}
                animate={{
                    opacity: 1
                }}transition={{
                    duration: 1.25
                }}>
                    <h1 className={windowWidth > 1330 ? "text-center text-white text-[12vw] font-semibold w-[100%] m-auto drop-shadow-[0_1px_35px_rgba(255,255,255,0.3)]" : (windowWidth>650?"text-center text-white text-[18vw] font-semibold w-[100%] m-auto":"text-center text-white text-[20vw] font-semibold w-[100%] m-auto")}>Welcome</h1>
                    <div className="w-full text-center sticky top-[20px]">
                        <Tabs size="lg" color="primary" className = "dark ">
                            <Tab className = "h-[40px]"title={"About"}>            

                            </Tab>
                            <Tab className = "h-[40px]"title={"Projects"}>

                            </Tab>
                            <Tab className = "h-[40px]"title={"Contact"}>

                            </Tab>
                        </Tabs>
                    </div>
            </motion.div>
        </div>
        
    );
}


function BaseMainHomePageOLD()
{
    return(
        <div className = "text-left mx-[10%] mt-[140px] flex justify-between content-center">
            <Header></Header>
            <Card className="flex fixed h-[600px] pt-[15px] pl-[15px] w-[40%] bg-[#353535] outline outline-[7px] outline-[#202020]">
                <CardHeader>
                    <div>
                        <span className="flex w-[100%] mr-[0px] justify-between">
                            <h1 className="text-white text-[30px] font-semibold w-[100%]">Archie Calvert</h1>
                            <Image src="/main/iconlarge.png" radius="full" className="w-[60px] justify-self-left"></Image>
                        </span>
                    <h1 className="text-left mt-[5px] text-white text-[15px] font-semibold w-[100%]">Computer Science at the University of Manchester</h1>
                    
                    </div>
                </CardHeader>
                <CardBody>
                    <h1 className="text-left text-white text-[15px] font-semibold w-[100%]">Current Projects</h1>

                    <hr className="absolute ml-[2.5%] mr-[5%] w-[90%] m-auto bottom-[65px]"></hr>
                    <div className="absolute bottom-[7px] w-[95%]">
                    <span className="flex align-center mt-[20px] mb-[10px] justify-center">
                        <a target="_blank" href="https://www.linkedin.com/in/archiecalvert/"><img className="w-7"src = "/main/linkedin.png"></img></a>
                        <a target="_blank" href="https://github.com/archiecalvert"><img className="ml-5 w-7"src = "/main/github.png"></img></a>
                        <a target="_blank" href="https://github.com/archiecalvert"><img className="ml-5 w-7"src = "/main/instagram.png"></img></a>

                    </span></div>
                </CardBody>
            </Card>
            <div className="text-center mr-[0px] ml-auto relative w-[50%]">
                <h1 className=" text-[20px] text-[#606060] mx-[10%]">Hello, my name is Archie Calvert and I am currently a student studing Computer Science at the University of Manchester.</h1>
                <h1 className="mt-[10px] text-[20px] text-[#606060] mx-[10%]">This webpage contains links to all of my social media, and also stores a collection of my projects, including what I am currently working on.</h1>

            </div>
        </div>
    );
}