import Button from "@/components/button";
import Header from "@/components/header";

export default function Home() {
    return (
        <>
            <div className="page-content flex justify-center w-full mt-[150px]">
                <div className="grid justify-items-center space-y-3 max-cols-1">
                    <h1 className="font-semibold mx-auto text-[55px]">AlbumFlow</h1>
                    <Button className="" backgroundColour="bg-[#1D1D1F] dark:bg-white" textColour="text-white dark:text-black">Sign In</Button>
                </div>
            </div>
        </>
    );
}
