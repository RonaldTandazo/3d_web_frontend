import { useColorMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { encodeToBase64 } from "@/utils/Helpers";
import { Box, Button, Grid, GridItem, Group, Icon, Image, Menu, Popover, Portal, Separator, Show, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

interface Artwork {
    artworkId: number,
    title: string,
    thumbnail: string
    publishingId: number,
    owner: string,
    createdAt: string
}

interface ArtworkMenuItemProps {
    artwork: Artwork;
    isOpen: boolean;
    onMenuToggle: (id: number | null) => void;
}

const backendUrl = import.meta.env.VITE_API_URL;

const ArtworkItem = ({ artwork, isOpen, onMenuToggle }: ArtworkMenuItemProps) => {
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const { colorMode }  = useColorMode();
    const navigate = useNavigate();

    const handleNavigateEditArtwork = (artwork: Artwork) => {
        const encodedArtworkId = encodeToBase64(artwork.artworkId);
        navigate(`/ArtWorks/${artwork.title}/${encodedArtworkId}/Edit`, { state: { artwork } });
    }

    const handleNavigateArtworkView = (artwork: Artwork) => {
        const encodedArtworkId = encodeToBase64(artwork.artworkId);
        navigate(`/ArtWorks/${artwork.title}/${encodedArtworkId}/View`, { state: { artwork } });
    }

    const handleClose = () => {
        setPopoverOpen(false);
        onMenuToggle(isOpen ? null : artwork.artworkId);
    }

    return (
        <GridItem 
            key={artwork.artworkId} 
            w="full" 
            h="full" 
            colSpan={1}
            overflow="hidden"
            borderRadius={"sm"}
        >
            <Image 
                src={`${backendUrl}/thumbnails/${artwork.thumbnail}`} 
                alt={`${artwork.title}`} 
                w="full" 
                h="auto" 
                cursor={"pointer"}
                objectFit="cover"
                onClick={() => handleNavigateArtworkView(artwork)}
            />
            <Box 
                p={2} 
                bg={colorMode === "light" ? "blackAlpha.300":"blackAlpha.950"}
            >
                <Grid
                    templateColumns="repeat(3, 1fr)"
                    display={"flex"}
                    justifyContent={"space-around"}
                    alignItems={"center"} 
                >
                    <Show 
                        when={artwork.publishingId !== 3}
                        fallback={
                            <GridItem colSpan={2}>
                                <Text justifySelf={"center"}>Draft</Text>
                            </GridItem>
                        }
                    >
                        <Tooltip
                            content={"120 Visualizations"}
                            openDelay={500}
                            closeDelay={100}
                            unmountOnExit={true}    
                            lazyMount={true}
                            positioning={{ placement: "top" }}
                            showArrow
                            contentProps={{ 
                                css: { 
                                    "--tooltip-bg": colorMode === "light" ? "colors.cyan.500":"colors.pink.500",
                                    'color': 'white'
                                }
                            }}
                        >    
                            <GridItem 
                                colSpan={1} 
                                display={"flex"} 
                                alignItems={"center"} 
                                justifyContent={"space-around"}
                            >
                                <IoEye />
                                <Text fontSize={"md"} ml={2}>
                                    120
                                </Text>
                            </GridItem>
                        </Tooltip>
                        <Tooltip
                            content={"120 Likes"}
                            openDelay={500}
                            closeDelay={100}
                            unmountOnExit={true}    
                            lazyMount={true}
                            positioning={{ placement: "top" }}
                            showArrow
                            contentProps={{ 
                                css: { 
                                    "--tooltip-bg": colorMode === "light" ? "colors.cyan.500":"colors.pink.500",
                                    'color': 'white'
                                }
                            }}
                        >    
                            <GridItem colSpan={1} display={"flex"} alignItems={"center"} justifyContent={"space-around"}>
                                <BiSolidLike />
                                <Text fontSize={"md"} ml={2}>
                                    120
                                </Text>
                            </GridItem>
                        </Tooltip>
                    </Show>              
                    <GridItem colSpan={1} display={"flex"} alignItems={"center"} justifyContent={"space-around"} cursor={"pointer"}>
                        <Menu.Root unmountOnExit lazyMount open={isOpen} onInteractOutside={handleClose}>
                            <Menu.Trigger asChild onClick={handleClose}>
                                <BsThreeDotsVertical />
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner>
                                    <Menu.Content minW={"1px"} >
                                        <Tooltip
                                            content="Edit"
                                            openDelay={500}
                                            closeDelay={100}
                                            unmountOnExit={true}
                                            lazyMount={true}
                                            positioning={{ placement: 'top' }}
                                            showArrow
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': colorMode === 'light' ? 'colors.cyan.500' : 'colors.pink.500',
                                                    'color': 'white',
                                                },
                                            }}
                                        >
                                            <Menu.Item value={'edit'} justifyContent={'center'} alignItems={'center'} onClick={() => handleNavigateEditArtwork(artwork)} cursor={"pointer"}>
                                                <Icon size={'sm'} color={colorMode === 'light' ? 'cyan.500' : 'pink.500'}>
                                                    <AiFillEdit />
                                                </Icon>
                                            </Menu.Item>
                                        </Tooltip>
                                        <Separator my={1} />
                                        <Tooltip
                                            content="Remove"
                                            openDelay={500}
                                            closeDelay={100}
                                            unmountOnExit={true}
                                            lazyMount={true}
                                            positioning={{ placement: 'top' }}
                                            showArrow
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': 'tomato',
                                                    'color': 'white'
                                                },
                                            }}
                                        >
                                            <Menu.Item value={'delete'} color="fg.error" _hover={{ bg: 'bg.error', color: 'fg.error' }} justifyContent={'center'} alignItems={'center'} cursor={"pointer"}>
                                                <Popover.Root lazyMount unmountOnExit open={popoverOpen}>
                                                    <Popover.Trigger asChild onClick={() => setPopoverOpen(!popoverOpen)}>
                                                        <Icon size={'sm'}>
                                                            <TiDelete />
                                                        </Icon>
                                                    </Popover.Trigger>
                                                    <Portal>
                                                        <Popover.Positioner>
                                                            <Popover.Content>
                                                                <Popover.Arrow />
                                                                <Popover.Header fontWeight="bold" color={colorMode === 'light' ? 'black' : 'white'}>
                                                                    Remove
                                                                </Popover.Header>
                                                                <Popover.Body>
                                                                    <Text color={colorMode === 'light' ? 'black' : 'white'}>Are you sure you want to remove this ArtWork?</Text>
                                                                </Popover.Body>
                                                                <Popover.Footer justifyContent={'flex-end'}>
                                                                    <Group display={'flex'}>
                                                                        <Button
                                                                            size="xs"
                                                                            bg={'tomato'}
                                                                            color={'white'}
                                                                            onClick={handleClose}
                                                                        >
                                                                            Yes
                                                                        </Button>
                                                                        <Button size="xs" onClick={() => setPopoverOpen(false)} variant={'surface'} bg={'transparent'} color={colorMode === 'light' ? 'black' : 'white'}>
                                                                            No
                                                                        </Button>
                                                                    </Group>
                                                                </Popover.Footer>
                                                            </Popover.Content>
                                                        </Popover.Positioner>
                                                    </Portal>
                                                </Popover.Root>
                                            </Menu.Item>
                                        </Tooltip>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>
                    </GridItem>
                </Grid>
            </Box>
        </GridItem>
    );
};

export default ArtworkItem;