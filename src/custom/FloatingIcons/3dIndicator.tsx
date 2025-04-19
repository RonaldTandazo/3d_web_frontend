import { Box, Icon } from "@chakra-ui/react";
import { Md3dRotation } from "react-icons/md";
import { useColorMode } from "@/components/ui/color-mode";

const Indicator3D = () => {
    const { colorMode } = useColorMode();

    return (
        <Box 
            bg={"blackAlpha.950"}
            mb={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            p={1}
            borderRadius={"full"}
        >
            <Icon
                size="md" 
                color={colorMode === "light" ? "cyan.500":"pink.500"}
            >        
                <Md3dRotation />
            </Icon>
        </Box>
    );
}

export default Indicator3D;