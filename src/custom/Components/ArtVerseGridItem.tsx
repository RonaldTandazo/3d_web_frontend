import { GridItem, Box, Image, Text, Grid, Avatar, Show, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import Indicator3D from "../FloatingIcons/3dIndicator";
import VideoIndicator from "../FloatingIcons/VideoIndicator";
import { useNavigate } from "react-router-dom";
import { encodeToBase64 } from "@/utils/Helpers";
import { useColorMode } from "@/components/ui/color-mode";
import { MdHideImage } from "react-icons/md";
import ImageIndicator from "../FloatingIcons/ImageIndicator";
import { Tooltip } from "@/components/ui/tooltip";

const MotionBox = motion.create(Box);
const backendUrl = import.meta.env.VITE_API_URL;

const ArtVerseGridItem = ({ artwork }: { artwork: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { colorMode }  = useColorMode();
    const navigate = useNavigate();

    const handleNavigate = (artwork: any) => {
        const encodedArtworkId = encodeToBase64(artwork.artworkId);
        navigate(`/ArtWorks/${artwork.title}/${encodedArtworkId}/View`, { state: { artwork } });
    }

    return (
        <GridItem 
            colSpan={1} 
            aspectRatio="1"
            position="relative" 
            overflow="hidden" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            cursor={"pointer"}
            onClick={() => handleNavigate(artwork)}
            key={artwork.artworkId} 
        >
            <Box 
                position="relative" 
                w="full" 
                h="full"
            >
                <Show
                    when={artwork.thumbnail}
                    fallback={
                        <Box
                            w={"full"}
                            h={"full"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                            color={'whiteAlpha.950'}
                            borderRadius={"sm"}
                        >
                            <Icon
                                as={MdHideImage}
                                cursor="pointer"
                                size={"2xl"}
                            />
                        </Box>
                    }
                >
                    <Image
                        src={`${backendUrl}/thumbnails/${artwork.thumbnail}`}
                        alt={artwork.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        aspectRatio={1}
                        borderRadius={"sm"}
                    />
                </Show>

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
                        <Show
                            when={artwork.hasImages}
                        >
                            <Tooltip
                                content={"Has Images"}
                                openDelay={500}
                                closeDelay={100}
                                unmountOnExit={true}    
                                lazyMount={true}
                                positioning={{ placement: "top" }}
                                showArrow
                                contentProps={{ 
                                    css: { 
                                        "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
                                        'color': 'white'
                                    }
                                }}
                            >
                                <ImageIndicator />
                            </Tooltip>
                        </Show>
                        <Show
                            when={artwork.hasVideos}
                        >
                            <Tooltip
                                content={"Has Videos"}
                                openDelay={500}
                                closeDelay={100}
                                unmountOnExit={true}    
                                lazyMount={true}
                                positioning={{ placement: "top" }}
                                showArrow
                                contentProps={{ 
                                    css: { 
                                        "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
                                        'color': 'white'
                                    }
                                }}
                            >
                                <VideoIndicator />
                            </Tooltip>
                        </Show>
                        <Show
                            when={artwork.has3DFile}
                        >
                            <Indicator3D />
                        </Show>
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
                                <Avatar.Image src={`${backendUrl}/avatars/${artwork.avatar}`} />
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
