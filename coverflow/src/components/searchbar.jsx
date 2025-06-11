import { GetQueue, PlayPlaylistOrSong, Search } from "@/api/player";
import { useEffect, useState, useRef } from "react";

export default function SearchBar({className, SetReload, SetNewData})
{
    const [searchData, SetSearchData] = useState([]);
    const [searchParam, SetSearchParam] = useState("")
    const [mouseTouching, SetMouseTouching] = useState(false)
    const [enabled, SetEnabled] = useState(false)
    const barRef = useRef();
    const textRef = useRef();


    useEffect(()=>{
        if(typeof window !== undefined)
        {
            window.addEventListener('mousemove', function (e) {
                // Get the bounding rectangle of target
                const rect = barRef.current.getBoundingClientRect();

                const mousePos = [e.clientX, e.clientY]

                if(rect.x < e.clientX &&
                    rect.right > e.clientX &&
                    rect.top < e.clientY &&
                    rect.bottom > e.clientY 
                )
                {
                    SetMouseTouching(true)
                }
                else{
                    SetMouseTouching(false);
                }
                
            });
        }
    }, [])
    useEffect(()=>{

        if(searchParam == "" || searchParam == null || searchParam.length == 0)
        {
            SetSearchData([]);
            return
        };
        Search(localStorage["access"], searchParam, "album").then(async res => {
            let data = []
            if(await res == null) return;
            
            await res.albums.items.map(datum => {
                data.push({
                    name: datum.name,
                    artwork: datum.images[0].url,
                    artist: datum.artists[0].name,
                    uri: datum.uri,
                    id: datum.id
                })
            })
            SetSearchData(data);
        })
    }, [searchParam])
    return(
        <div ref={barRef} className={className}>
            <div style={{transition: ["height 1s ease", "width 0.3s ease"]}} className={`transition transition-ease-in-out !z-[9999] overflow-y-scroll overflow-x-hidden rounded-3xl max-h-[400px] hover:w-[600px] items-start px-[10px] py-[10px] space-x-[5px] bg-[#ff0000] ${enabled ? "h-auto w-[600px]" : 'h-[45px] w-[350px]'} hover:h-auto  shadow-lg bg-[rgba(233,233,233,1)] dark:bg-[#1D1D1F] border-[#A0A0A0] border-[0.5px] dark:border-[#6E6E73]`}>
                <div className="w-full flex flex-row">
                    <img src="/search.svg" className="dark:invert"></img>
                    <input onFocus={()=>SetEnabled(true)} onBlur={()=>{SetEnabled(false)}} ref = {textRef} onChange={e=>SetSearchParam(e.target.value)} type="text" placeholder="Search" className="w-full outline-none"></input>
                </div>
            
                <div className="flex flex-col">
                {(mouseTouching ||enabled) && searchData != null && searchData.map((item, index) => {
                    return(
                        <div onClick={()=>{PlayPlaylistOrSong(localStorage["access"], item.uri, item.id).then(async e=>{SetReload(true); SetNewData(await GetQueue(localStorage["access"]))})}}key={index} className="cursor-pointer flex flex-row w-full h-[60px]">
                            <img src={item.artwork} className="my-auto w-[35px] h-[35px] rounded-md aspect-square"></img>
                            <div className="ml-[10px] my-auto">
                                <h1 className="text-[15px]">{item.name}</h1>
                                <h1 className="text-[13px] opacity-[50%]">{item.artist}</h1>
                            </div>
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}