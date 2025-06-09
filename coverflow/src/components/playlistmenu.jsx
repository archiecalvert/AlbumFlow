import { PlayPlaylistOrSong } from "@/api/player";

export default function PlaylistMenu({data, SetReloadFlag = ()=>{}, SetNewData = () => {}})
{
    return(
        
        <div style = {style} className="text-left ease-initial transition ease-in-out grid max-cols-1 overflow-x-hidden p-[10px] max-w-[90%] space-y-[10px] overscroll-none overflow-y-scroll h-[90%] w-[75px] hover:w-[350px] fixed top-[0px] mt-[50px] left-[10px] z-[10] rounded-lg shadow-lg bg-[rgba(233,233,233,1)] dark:bg-[#1D1D1F] border-[#A0A0A0] border-[0.5px] dark:border-[#6E6E73]">
            {(data!=null && data.items!=undefined) && data.items.map((item, index) => {
                return(
                    <span onClick={()=>{PlayPlaylistOrSong(localStorage["access"], item.uri, item.id).then(async e=>{SetNewData(e); SetReloadFlag(true)})}} key ={index} className="cursor-pointer flex space-x-3 text-nowrap">
                        <img src={item.images[0].url} className="cursor-pointer w-[55px] h-[55px] object-cover rounded-lg"></img>
                        <div>
                            <h1 className="my-auto">{item.name}</h1>
                            <h1 className="text-[#808080]">{item.owner.display_name}</h1>
                        </div>
                            
                    </span>
            )
            })}
        </div>
    );

}
const style = {
    "scrollbarWidth": "none",
    "::WebkitScrollbar": {
        display: "none"
    },
    transition: "width 0.25s",
}