import { Box, Icon } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { IoMdImages } from "react-icons/io";

const ImageIndicator = () => {
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
                color={colorMode === "light" ? "cyan.600" : "pink.600"}
            >
                <IoMdImages />
            </Icon>
        </Box>
    );
}

export default ImageIndicator;