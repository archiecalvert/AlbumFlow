import { GetQueue, GetUserSavedAlbums, PlayPlaylistOrSong, PlaySong, Search } from "@/api/player";
import { useEffect, useState, useRef } from "react";
import ButtonGroup from "./buttongroup";
import Button from "./button";

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

    const [playListData, SetPlaylistData] = useState([]);
    const [albumData, SetAlbumData] = useState([]);
    const [artistData, SetArtistData] = useState([]);
    
    // Holds the value of the search query in "searchParam"
    const [searchParam, SetSearchParam] = useState("")

    // Boolean variable determining when the mouse is inside of the searchbar
    const [mouseTouching, SetMouseTouching] = useState(false)

    // Holds the album data when there is no search query
    const [userAlbums, SetUserAlbums] = useState([])

    // Whether the search bar is enabled/in focus
    // This is used for when the bar needs to be active, even when the mouse is outside
    // the bounding box.
    const [enabled, SetEnabled] = useState(false)

    // Reference to the search bar
    const barRef = useRef();

    const [filter, SetFilter] = useState("Albums")

    // Keeps track of the browser window dimensions
    const [windowWidth, SetWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);
    const [windowHeight, SetWindowHeight] = useState(typeof window !== "undefined" ? window.innerHeight: 1080);
    
    useEffect(()=>{
        if(typeof window !== undefined)
        {
            // Adds event listeners to keep track of the window size
            window.addEventListener("resize", () => {
                SetWindowWidth(window.innerWidth);
                SetWindowHeight(window.innerHeight);
            });

            // Runs each time the mouse is moved
            window.addEventListener('mousemove', function (e) {
                if(barRef == null || barRef.current == null) return;
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

    useEffect(()=>{
        GetUserSavedAlbums(localStorage["access"]).then(async res => {
            if(await res == null) return;
            
            // Formats and adds the data to the 'searchData' variable
            let data = []
            await res.items.map(datum => {
                data.push({
                    name: datum.name,
                    artist: datum.owner.display_name,
                    artwork: datum.images[0].url,
                    uri: datum.uri,
                    id: datum.id,
                    onClick: ()=>{PlayPlaylistOrSong(localStorage["access"], datum.uri, datum.id).then(async e=>{SetReload(true); SetNewData(await GetQueue(localStorage["access"]))})}

                })
            })
            SetUserAlbums(data);
            SetSearchData(data)
        })
    }, [])
    // Runs each time the search bar text is changed
    useEffect(()=>{
        
        // Checks to see if the searchbar is empty
        if(searchParam == "" || searchParam == null || searchParam.length == 0)
        {
            SetSearchData(userAlbums);
            return
        };

        // Calls on the API to get the data from the relevant query
        Search(localStorage["access"], searchParam, filter.toLowerCase().slice(0, filter.length - 1)).then(async res => {
            if(await res == null) return;

            // Formats and adds the data to the 'searchData' variable
            let data = []
            if(filter == "Albums"){
                await res.albums.items.map(datum => {
                    if(datum != null){
    
                        data.push({
                            name: datum.name,
                            artwork: datum.images[0].url,
                            artist: datum.artists[0].name,
                            uri: datum.uri,
                            id: datum.id,
                            onClick:()=>{PlayPlaylistOrSong(localStorage["access"], datum.uri, datum.id).then(async e=>{SetReload(true); SetNewData(await GetQueue(localStorage["access"]))})
                            }
                        })
                    }
                })
                SetSearchData(data);

            }
            else if(filter == "Playlists")
            {
                await res.playlists.items.map(datum => {
                    if(datum != null){         
                        data.push({
                            name: datum.name,
                            artwork: datum.images[0].url,
                            artist: datum.owner.display_name,
                            uri: datum.uri,
                            id: datum.id,
                            onClick: ()=>{PlayPlaylistOrSong(localStorage["access"], datum.uri, datum.id).then(async e=>{SetReload(true); SetNewData(await GetQueue(localStorage["access"]))})
                            }
                        })
                    }
                })

                SetSearchData(data);
            }
            else if(filter == "Artists")
            {
                await res.artists.items.map(datum => {
                    if(datum != null && datum.images[0] != undefined)
                    {
                        data.push({
                            name: datum.name || "",
                            artwork: datum.images[0].url || "",
                            artist: "",
                            uri: datum.uri || "",
                            id: datum.id || "",
                            onClick: ()=>{PlayPlaylistOrSong(localStorage["access"], datum.uri, datum.id).then(async e=>{SetReload(true); SetNewData(await GetQueue(localStorage["access"]))})
                            }
                        })
                    }
                })
                SetSearchData(data);
            }
            else if(filter == "Tracks")
            {
                await res.tracks.items.map(datum => {
                    if(datum != null){         
                        data.push({
                            name: datum.name,
                            artwork: datum.album.images[0].url,
                            artist: datum.artists[0].name,
                            uri: datum.uri,
                            id: datum.id,
                            onClick: ()=>{PlaySong(localStorage["access"], datum.uri, datum.id).then(async e=>{SetReload(true); SetNewData(await GetQueue(localStorage["access"]))})
                        }})
                    }
                })
                SetSearchData(data);

            }
            
        })

    }, [searchParam, filter])


    return(
        // Container that applies the styles from the component
        <div ref={barRef} className={className}> 
            <div style={{"scrollbarWidth": "none", "::WebkitScrollbar": {display: "none"}, transition: "width 0.25s",transition: ["height 1s ease", "width 0.3s ease"]}} className={`transition transition-ease-in-out !z-[9999] overflow-y-scroll overflow-x-hidden rounded-3xl max-h-[400px] items-start px-[10px] py-[10px] space-x-[5px] bg-[#ff0000] ${enabled || mouseTouching ? `h-auto ${windowWidth > 600 ? 'w-[600px]' : 'w-[95vw]'}` : `h-[45px] ${windowWidth > 600 ? 'w-[350px]' : 'w-[95vw]'}`}  shadow-lg bg-[rgba(233,233,233,1)] dark:bg-[#1D1D1F] border-[#A0A0A0] border-[0.5px] dark:border-[#6E6E73]`}>
                <div className="w-full flex flex-row">
                    <img src="/search.svg" className="dark:invert mr-[5px]"></img>
                    <input onFocus={()=>SetEnabled(true)} onBlur={()=>{SetEnabled(false)}} onChange={e=>SetSearchParam(e.target.value)} type="text" placeholder="Search" className="w-full outline-none"></input>
                </div>
            
                <div className="flex flex-col">
                    {/* Iterates through each search result and adds it under the input */}
                    {(mouseTouching || enabled) && searchData != null && 
                    <>
                    
                    <ButtonGroup tab={SetFilter} className="my-[10px] top-0 grid max-desktop:grid-cols-2 grid-cols-4 sticky !z-[10]">
                        <Button backgroundColour="bg-[#1D1D1F] dark:bg-white" textColour="text-white dark:text-black" className="">Albums</Button>
                        <Button backgroundColour="bg-[#1D1D1F] dark:bg-white" textColour="text-white dark:text-black" className="">Playlists</Button>
                        <Button backgroundColour="bg-[#1D1D1F] dark:bg-white" textColour="text-white dark:text-black" className="">Artists</Button>
                        <Button backgroundColour="bg-[#1D1D1F] dark:bg-white" textColour="text-white dark:text-black" className="">Tracks</Button>
                    </ButtonGroup>
                    {searchData.map((item, index) => {
                        return(
                            <div onClick={()=>item.onClick()} key={index} className="cursor-pointer flex flex-row w-full h-[60px]">
                                <img src={item.artwork} className="my-auto w-[35px] h-[35px] rounded-md aspect-square"></img>
                                <div className="ml-[10px] my-auto">
                                    <h1 className="text-[15px]">{item.name}</h1>
                                    <h1 className="text-[13px] opacity-[50%]">{item.artist}</h1>
                                </div>
                            </div>
                        )
                    })}
                    </>
                    }
                </div>
            </div>
        </div>
    )
}