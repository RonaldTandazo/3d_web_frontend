import { useColorMode } from "@/components/ui/color-mode";
import { EmptyState, Flex, Icon, VStack } from "@chakra-ui/react"
import { MdHideSource } from "react-icons/md"

const Empty = () => {
    const { colorMode } = useColorMode();
    
    return (
        <Flex 
            h="35vh" 
            align="center" 
            justify="center"
            mb={10}
        >
            <EmptyState.Root>
                <EmptyState.Content>
                        <Icon
                            boxSize={"300px"}
                            color={colorMode === "light" ? "pink.500" : "cyan.500"}
                        >        
                            <MdHideSource />
                        </Icon>
                    <VStack textAlign="center">
                        <EmptyState.Title>Oooh no!... There's no information about the Art you selected 😢</EmptyState.Title>
                        <EmptyState.Description>
                            Don't worry, there are many other amazing Arts for you to discover!
                        </EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>
        </Flex>
    )
}

export default Empty