import { Card, Image, Text } from "@chakra-ui/react";

interface DecorativeBoxProps {
    name: string | null;
    image: string | null;
}

const DecorativeBox = ({ name, image }: DecorativeBoxProps) => {
    return (
        <Card.Root 
            bg="white" 
            color={"black"} 
            display={"flex"} 
            alignItems="center" 
            justifyContent="center"
            textAlign="center"
            h="full"
            w="full"
            borderRadius={"sm"}
            border={"none"}
            overflow="hidden"
        >
            {name && !image &&(
                <Text>{name}</Text>
            )}

            {image && (
                <Image
                    src={image}
                    alt={name || ""}
                    aspectRatio={1}
                    w="100vw"
                    h="100vh"
                />
            )}
        </Card.Root>
    );
};

export default DecorativeBox;
