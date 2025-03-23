import { Flex, ProgressCircle } from "@chakra-ui/react";

const LoadignScreen = () => {
    return (
        <Flex 
            h="100vh" 
            w="98vw" 
            align="center" 
            justify="center"
        >
            <ProgressCircle.Root value={null} size="xl">
                <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range strokeLinecap="round" stroke={"cyan.600"}/>
                </ProgressCircle.Circle>
            </ProgressCircle.Root>
        </Flex>
    );
}

export default LoadignScreen;