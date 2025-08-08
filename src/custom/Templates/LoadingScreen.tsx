import { Flex } from "@chakra-ui/react";
import LoadingProgress from "../Components/LoadingProgress";
import { useColorMode } from "@/components/ui/color-mode";

const LoadingScreen = () => {
    const { colorMode } = useColorMode();
     
    return (
        <Flex 
            w={"100dvw"}
            h={"100dvh"}
            align="center" 
            justify="center"
            bg={colorMode === "light" ? "gray.100" : "gray.950"}
        >
            <LoadingProgress />
        </Flex>
    );
}

export default LoadingScreen;