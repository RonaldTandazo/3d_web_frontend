import { GridItem, Box, Image, Text, Grid, Show, Avatar } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import Indicator3D from "../FloatingIcons/3dIndicator";
import VideoIndicator from "../FloatingIcons/VideoIndicator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const MotionBox = motion.create(Box);
const backendUrl = import.meta.env.VITE_API_URL;

const ArtVerseGridItem = ({ artwork }: { artwork: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleNavigate = (artwork: any) => {
        navigate(`/Specifications/${artwork.artworkId}`, { state: { artwork } });
    }

    return (
        <GridItem 
            colSpan={1} 
            aspectRatio="1"
            position="relative" 
            overflow="hidden" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Box 
                position="relative" 
                w="100%" 
                h="100%"
                onClick={() => handleNavigate(artwork)}
                cursor={"pointer"}
            >
                <Image
                    src={`${backendUrl}/thumbnails/${artwork.thumbnail}`}
                    alt={artwork.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    aspectRatio={1}
                    borderRadius={"sm"}
                    //cursor={"pointer"}
                />

                <MotionBox
                    position="absolute"
                    top="0"
                    bottom={isHovered ? "0" : "-100%"}
                    w="100%"
                    h="100%"
                    backgroundImage={isHovered ? 
                        "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))"
                        : "none"
                    }
                    color="white"
                    display="flex"
                    flexDirection="column"
                    justifyContent="end"
                    initial={{ y: "100%" }}
                    animate={{ y: isHovered ? "0%" : "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    p={3}
                    //cursor={"pointer"}
                >
                    <Box display="flex" flexDirection="column" alignItems="end" h={"100%"}>
                        <VideoIndicator />
                        <Indicator3D />
                    </Box>
                    <Grid
                        templateRows="repeat(2, auto)"
                        templateColumns="repeat(20, auto)"
                        position={"relative"}
                        h={"auto"}
                    >   
                        <GridItem 
                            colSpan={1}
                            rowSpan={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Avatar.Root key={"subtle"} variant={"subtle"}>
                                <Avatar.Fallback name={artwork.owner} />
                                <Avatar.Image src={artwork.avatar} />
                            </Avatar.Root>
                        </GridItem>
                        <GridItem 
                            colSpan={19}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                        >
                            <Text fontSize="md" fontWeight="bold">{artwork.title}</Text>
                        </GridItem>
                        <GridItem 
                            colSpan={19}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                        >
                            <Text fontSize="sm">{artwork.owner}</Text>
                        </GridItem>
                    </Grid>
                </MotionBox>
            </Box>
        </GridItem>
    );
};

export default ArtVerseGridItem;
