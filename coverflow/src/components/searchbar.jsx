import { GetQueue, PlayPlaylistOrSong, Search } from "@/api/player";
import { useEffect, useState, useRef } from "react";

export default function SearchBar({className, SetReload, SetNewData})
{
    /* Holds the data from the latest search query
       This is in an object with the values:
           - name : The name of the album/data item
           - artist : The name of the artist which created the item
           - artwork : A URL that contains the album artwork
           - uri : The content URI used for changing the players state with the API
           - id : The content ID used for changing the players state with the API
    */
    const [searchData, SetSearchData] = useState([]);

    // Holds the value of the search query in "searchParam"
    const [searchParam, SetSearchParam] = useState("")

    // Boolean variable determining when the mouse is inside of the searchbar
    const [mouseTouching, SetMouseTouching] = useState(false)

    // Whether the search bar is enabled/in focus
    // This is used for when the bar needs to be active, even when the mouse is outside
    // the bounding box.
    const [enabled, SetEnabled] = useState(false)

    // Reference to the search bar
    const barRef = useRef();

    useEffect(()=>{
        if(typeof window !== undefined)
        {
            // Runs each time the mouse is moved
            window.addEventListener('mousemove', function (e) {
                if(barRef == null) return;
                // Get the bounding box of the searchbar
                const rect = barRef.current.getBoundingClientRect();

                // Check to see if the mouse is within the searchbar
                SetMouseTouching(rect.x < e.clientX &&
                                 rect.right > e.clientX &&
                                 rect.top < e.clientY &&
                                 rect.bottom > e.clientY)
            });
        }
    }, [])

    // Runs each time the search bar text is changed
    useEffect(()=>{

        // Checks to see if the searchbar is empty
        if(searchParam == "" || searchParam == null || searchParam.length == 0)
        {
            SetSearchData([]);
            return
        };

        // Calls on the API to get the data from the relevant query
        Search(localStorage["access"], searchParam, "album").then(async res => {
            if(await res == null) return;
            
            // Formats and adds the data to the 'searchData' variable
            let data = []
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
        // Container that applies the styles from the component
        <div ref={barRef} className={className}> 
            <div style={{"scrollbarWidth": "none", "::WebkitScrollbar": {display: "none"}, transition: "width 0.25s",transition: ["height 1s ease", "width 0.3s ease"]}} className={`transition transition-ease-in-out !z-[9999] overflow-y-scroll overflow-x-hidden rounded-3xl max-h-[400px] hover:w-[600px] items-start px-[10px] py-[10px] space-x-[5px] bg-[#ff0000] ${enabled ? "h-auto w-[600px]" : 'h-[45px] w-[350px]'} hover:h-auto  shadow-lg bg-[rgba(233,233,233,1)] dark:bg-[#1D1D1F] border-[#A0A0A0] border-[0.5px] dark:border-[#6E6E73]`}>
                <div className="w-full flex flex-row">
                    <img src="/search.svg" className="dark:invert"></img>
                    <input onFocus={()=>SetEnabled(true)} onBlur={()=>{SetEnabled(false)}} onChange={e=>SetSearchParam(e.target.value)} type="text" placeholder="Search" className="w-full outline-none"></input>
                </div>
            
                <div className="flex flex-col">
                    {/* Iterates through each search result and adds it under the input */}
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