import { Icon } from "@chakra-ui/react";
import { Md3dRotation } from "react-icons/md";
import { useColorMode } from "@/components/ui/color-mode";

const Indicator3D = () => {
    const { colorMode } = useColorMode();

    return (
        <Icon
            position="relative"
            size="lg" 
            color={colorMode === "light" ? "pink.500" : "cyan.500"}
        >        
            <Md3dRotation />
        </Icon>
    );
}

export default Indicator3D;