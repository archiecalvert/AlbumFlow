import {extendVariants, Button} from "@nextui-org/react";

export const CustomButton = extendVariants(Button, {
    variants:{
        color: {
            green: "text-[#FFFFFF] bg-[#1DB954]"
        }
    }
})