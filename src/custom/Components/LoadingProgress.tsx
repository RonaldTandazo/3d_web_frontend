import { useColorMode } from "@/components/ui/color-mode"
import { ProgressCircle } from "@chakra-ui/react"

const LoadingProgress = () => {
    const { colorMode } = useColorMode()

    return (
        <ProgressCircle.Root size={"xl"} value={null}>
            <ProgressCircle.Circle>
                <ProgressCircle.Track />
                <ProgressCircle.Range strokeLinecap="round" stroke={colorMode === "light" ? "cyan.500":"pink.500"}/>
            </ProgressCircle.Circle>
        </ProgressCircle.Root>
    )
}

export default LoadingProgress