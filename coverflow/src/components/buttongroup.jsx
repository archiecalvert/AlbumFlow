"use client"

import { useState, useEffect } from "react";
import Button from "@/components/button";
export default function ButtonGroup({ ref, children, initialIndex = 0, tab = (page) => {}, className}) {
    const [buttons, setButtons] = useState([]);
    const [currentItem, setCurrentItem] = useState("")
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        setCurrentItem(children[initialIndex].props.children)
        ConfigureButtons()
        setLoaded(true);
        tab(currentItem)
    }, [])

    useEffect(()=>{
        ConfigureButtons()
        tab(currentItem)
    }, [currentItem])

    function ConfigureButtons() {
        let tempArr = []
        for (let i = 0; i < children.length; i++) {
           
            tempArr.push(
                <Button 
                    key = {i}
                    onClick={() => {
                        if (children[i].props.onClick != undefined) children[i].props.onClick()
                        setCurrentItem(children[i].props.children);
                    }}
                    className={`${children[i].props.className} w-full`}
                    backgroundColour={currentItem == children[i].props.children ? children[i].props.backgroundColour : ""}
                    textColour={currentItem == children[i].props.children ? children[i].props.textColour : "text-black dark:text-white"}
                >
                    {children[i].props.children}
                </Button>
            )
            setButtons(tempArr);
        }
    }
    if(!loaded) return;
    return (
            <span ref={ref} className={`${className} space-x-[5px] px-[5px] py-[5px] rounded-[17px] bg-[rgba(233,233,233,1)] dark:bg-[#1D1D1F] border-[#A0A0A0] border-[1.5px] dark:border-[#6E6E73]`}>
                {buttons}

            </span>
    )
}