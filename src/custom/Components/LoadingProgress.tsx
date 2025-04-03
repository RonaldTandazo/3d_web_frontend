import { useColorMode } from "@/components/ui/color-mode"
import { Box, ProgressCircle } from "@chakra-ui/react"

const LoadingProgress = () => {
    const { colorMode } = useColorMode()

    return (
        <Box w={"full"} display={"flex"} h={"full"} justifyContent={"center"} alignItems={"center"}>
            <ProgressCircle.Root size={"xl"} value={null}>
                <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range strokeLinecap="round" stroke={colorMode === "light" ? "cyan.500":"pink.500"}/>
                </ProgressCircle.Circle>
            </ProgressCircle.Root>
        </Box>
    )
}

export default LoadingProgress