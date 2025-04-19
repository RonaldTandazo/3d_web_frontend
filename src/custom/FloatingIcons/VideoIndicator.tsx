import { Box, Icon } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { MdSlowMotionVideo } from "react-icons/md";

const VideoIndicator = () => {
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
                color={colorMode === "light" ? "cyan.500" : "pink.500"}
            >
                <MdSlowMotionVideo />
            </Icon>
        </Box>
    );
}

export default VideoIndicator;