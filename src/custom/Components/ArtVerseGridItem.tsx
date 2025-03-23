import { GridItem, Box, Image, Text, Grid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import DecorativeBox from "../Templates/DecorativeBox";

const MotionBox = motion(Box);

const ArtVerseGridItem = ({ item }: { item: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <GridItem 
            colSpan={1} 
            aspectRatio="1"
            position="relative" 
            overflow="hidden" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Box position="relative" w="100%" h="100%">
                <Image
                    src={item.image}
                    alt={item.name}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    aspectRatio={1}
                    transition="0.5s ease"
                    filter={isHovered ? "brightness(50%)" : "brightness(100%)"}
                />

                <MotionBox
                    position="absolute"
                    top="0"
                    bottom={isHovered ? "0" : "-100%"}  // Aparece desde abajo
                    left={isHovered ? "0" : "-100%"}
                    w="100%"
                    h="100%"
                    bg="rgba(0, 0, 0, 0.25)"
                    color="white"
                    display="flex"
                    flexDirection="column"
                    justifyContent="end"
                    //alignItems="center"
                    //textAlign="center"
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovered ? "0%" : "-100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    p={3}
                >
                    <Grid
                        templateRows="repeat(2, auto)"
                        templateColumns="repeat(20, auto)"
                        position={"relative"}
                    >
                        <GridItem 
                            colSpan={1}
                            rowSpan={1}
                            top={5}
                        >
                            <DecorativeBox name={"video"} image={null}/>
                        </GridItem>
                        <GridItem 
                            colSpan={1}
                            rowSpan={1}
                        >
                            <DecorativeBox name={"3D"} image={null}/>
                        </GridItem>
                        <GridItem 
                            colSpan={1}
                            rowSpan={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Image
                                src={item.image}
                                boxSize="40px"
                                borderRadius="full"
                                fit="cover"
                                alt="avatar"
                            />
                        </GridItem>
                        <GridItem 
                            colSpan={19}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                        >
                            <Text fontSize="md" fontWeight="bold">{item.name}</Text>
                        </GridItem>
                        <GridItem 
                            colSpan={19}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                        >
                            <Text fontSize="sm">{item.species}</Text>
                        </GridItem>
                    </Grid>
                </MotionBox>
            </Box>
        </GridItem>
    );
};

export default ArtVerseGridItem;
