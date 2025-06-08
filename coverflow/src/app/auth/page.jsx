"use client";
import { GetTokens } from "@/api/auth";
import { useEffect, useState } from "react";

export default function Page()
{
    const [called, setCalled ] = useState(false);
    useEffect(() => {
        async function Call()
        {
            const urlParams = new URLSearchParams(window.location.search);
            const auth = urlParams.get("code");
            const state = urlParams.get("state");
            const response = await GetTokens(auth, state);
            
            if(response.status == 200)
            {
                console.log(await response)
                localStorage["access"] = response.access;
                localStorage["refresh"] = response.refresh;
                window.location.href = "/player"
            }
            else{
                
            }
            setCalled(true);
        }
        Call()
    }, [])
    return(
    <>
        <div className="flex justify-center mt-[150px]">
            {
                called == false ? 
                <>
                    <h1 className="text-[50px]">Authenticating</h1>
                </>
                :
                <>
                    <h1 className="text-[50px]">Authentication Failed</h1>
                </>
            }
        </div>
    </>);

}