import { useColorMode } from "@/components/ui/color-mode";
import { EmptyState, Flex, Icon, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { MdHideSource } from "react-icons/md"

const Empty = ({ title, description, default_description = true }: any) => {
    const { colorMode } = useColorMode();
    const [header, setHeader] = useState("No Data Available")
    const [subtle, setSubtle] = useState("No content to show")

    useEffect(() => {
        if(title){
            setHeader(title);
        }

        if(!default_description){
            setSubtle('');
        }

        if(description){
            setSubtle(description);
        }

    }, [title, description, default_description])

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
                            color={colorMode === "light" ? "cyan.600":"pink.600"}
                        >        
                            <MdHideSource />
                        </Icon>
                    <VStack textAlign="center">
                        <EmptyState.Title>{ header }</EmptyState.Title>
                        <EmptyState.Description>{ subtle }</EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>
        </Flex>
    )
}

export default Empty