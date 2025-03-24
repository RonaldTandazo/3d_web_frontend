import { Icon } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { MdSlowMotionVideo } from "react-icons/md";

const VideoIndicator = () => {
    const { colorMode } = useColorMode();

    return (
        <Icon
            position="relative"
            size="lg" 
            color={colorMode === "light" ? "pink.500" : "cyan.500"}
            mb={2}
        >
            <MdSlowMotionVideo />
        </Icon>
    );
}

export default VideoIndicator;