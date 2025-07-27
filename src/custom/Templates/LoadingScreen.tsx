import { useColorMode } from "@/components/ui/color-mode";
import { Flex, ProgressCircle } from "@chakra-ui/react";

const LoadignScreen = () => {
    const { colorMode } = useColorMode();
    
    return (
        <Flex 
            w={"99dvw"}
            h={"full"}
            align="center" 
            justify="center"
        >
            <ProgressCircle.Root value={null} size="xl">
                <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range strokeLinecap="round" stroke={colorMode === "light" ? "cyan.500":"pink.500"}/>
                </ProgressCircle.Circle>
            </ProgressCircle.Root>
        </Flex>
    );
}

export default LoadignScreen;