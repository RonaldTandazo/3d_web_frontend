import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { Box, Button, EmptyState, Flex, For, Grid, GridItem, Icon, IconButton, Image, Separator, Show, Stack, Text, VStack } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { BsGlobe2, BsTelephoneFill } from "react-icons/bs";
import { MdEmail, MdHideSource } from "react-icons/md";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FaPlusSquare, FaUserEdit } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import IconsSocialMedia from "@/custom/Components/IconsSocialMedia";
import { useGetUserSocialMedia } from "@/services/UserSocialNetwork/UserSocialNetworkService";
import LoadingScreen from "@/custom/Templates/LoadingScreen";
import { useGetUserArtworks } from "@/services/Artwork/ArtworkService";
import ArtworkItem from "@/custom/Components/ArtworkItem";
import { useSubscription } from "@apollo/client";
import { NEW_ARTWORK_SUBSCRIPTION } from "@/graphql/Artwork/ArtworkSubscription";
import { ImUser } from "react-icons/im";
import LoadingProgress from "@/custom/Components/LoadingProgress";
import Empty from "@/custom/Templates/Empty";

interface Artwork {
    artworkId: number,
    title: string,
    thumbnail: string,
    publishingId: number,
    createdAt: string,
    owner: string
}

interface UserSocialNetwork {
    userSocialNetworkId: number,
    network: string,
    link: string
}

const backendUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
    const { colorMode } = useColorMode();
    const { user } = useAuth();
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [isUserInfoVisible, setIsUserInfoVisible] = useState(true);
    const navigate = useNavigate();
    const [userSocialMedia, setUserSocialMedia] = useState([]);
    const [artworks, setArtworks] = useState([])
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    
    const { getUserSocialMedia, data: userSocialMediaData, loading: userSocialMediaLoading } = useGetUserSocialMedia();
    const { getUserArtworks, data: userArtworksData, loading: userArtworksLoading } = useGetUserArtworks();
    const { data, loading, error } = useSubscription(NEW_ARTWORK_SUBSCRIPTION);

    const charsPerLine = 50;
    const maxLines = 2;
    const estimatedLines = user?.summary && user.summary !== '' ? Math.ceil(user?.summary.length / charsPerLine) : 0;
    const shouldExpand = estimatedLines > maxLines;

    const truncatedSummary = user?.summary && shouldExpand && !isSummaryExpanded
        ? user.summary.slice(0, maxLines * charsPerLine) + '...'
        : user?.summary;

    useEffect(() => {
        getUserArtworks()
        getUserSocialMedia();
    }, []);

    useEffect(() => {
        if (userSocialMediaData && userSocialMediaData.getUserSocialMedia) {
            setUserSocialMedia(userSocialMediaData.getUserSocialMedia)
        }
    }, [userSocialMediaData]);

    useEffect(() => {
        if (userArtworksData && userArtworksData.getUserArtworks) {
            setArtworks(userArtworksData.getUserArtworks)
        }
    }, [userArtworksData]);

    useEffect(() => {
        if (data && data.newArtwork) {
            const newArtwork: Artwork = data.newArtwork.artwork;
            setArtworks((prevArtworks) => [...prevArtworks, newArtwork]);
        }
    }, [data]);

    const handleNavigateSettings = () => {
        if (user && user?.username) {
            navigate(`/ProfileSettings/${user.username}`)
        }
    }

    const handleNavigateNewArt = () => {
        navigate(`/ArtWorks/New`)
    }

    const handleMenuOpen = (id: number | null) => {
        setOpenMenuId(id);
    };

    return (
        <Show
            when={!userSocialMediaLoading && !userArtworksLoading}
            fallback={
                <LoadingProgress />
            }
        >
            <Box w={"auto"} h={"auto"}>
                <Grid
                    templateColumns={isUserInfoVisible ? "1fr 4fr" : "1fr"}
                    w={"full"}
                    gap={5}
                    alignItems={"start"}
                >
                    <AnimatePresence>
                        <Show
                            when={isUserInfoVisible}
                        >
                            <motion.div
                                key="userInfo"
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%", transition: { duration: 0.3 } }}
                                transition={{ duration: 0.3 }}
                                style={{ gridColumn: "1 / 2" }}
                            >
                                <GridItem
                                    bg={colorMode === 'light' ? "whiteAlpha.950" : "blackAlpha.500"}
                                    rounded={"lg"}
                                    shadow={"lg"}
                                    p={7}
                                    overflowY={"auto"}
                                    maxH={"80vh"}
                                    maxW={"20vW"}
                                >
                                    <Box position="relative" width={"100%"}>
                                        <Tooltip
                                            content="Hide Profile"
                                            openDelay={500}
                                            closeDelay={100}
                                            unmountOnExit={true}
                                            lazyMount={true}
                                            positioning={{ placement: 'top' }}
                                            showArrow
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': colorMode === 'light' ? 'colors.cyan.600' : 'colors.pink.600',
                                                    'color': 'white',
                                                },
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => setIsUserInfoVisible(false)}
                                                borderRadius="full"
                                                colorScheme="black"
                                                size="md"
                                                bg={"transparent"}
                                                color={colorMode === "light" ? "cyan.600" : "pink.600"}
                                                position="absolute"
                                                top="-20px"
                                                left="-20px"
                                            >
                                                <IoEyeOff />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                            content="Edit Profile"
                                            openDelay={500}
                                            closeDelay={100}
                                            unmountOnExit={true}
                                            lazyMount={true}
                                            positioning={{ placement: 'top' }}
                                            showArrow
                                            contentProps={{
                                                css: {
                                                    '--tooltip-bg': colorMode === 'light' ? 'colors.cyan.600' : 'colors.pink.600',
                                                    'color': 'white',
                                                },
                                            }}
                                        >
                                            <IconButton
                                                borderRadius="full"
                                                colorScheme="black"
                                                size="md"
                                                bg={"transparent"}
                                                color={colorMode === "light" ? "cyan.600" : "pink.600"}
                                                position="absolute"
                                                top="-20px"
                                                right="-20px"
                                                onClick={handleNavigateSettings}
                                            >
                                                <FaUserEdit />
                                            </IconButton>
                                        </Tooltip>
                                        <Stack>
                                            <Box
                                                w="100%"
                                                display={"flex"}
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Show
                                                    when={user.avatar}
                                                    fallback={
                                                        <Icon
                                                            as={ImUser}
                                                            boxSize="200px"
                                                            color={colorMode === 'light' ? 'cyan.50' : 'pink.200'}
                                                            bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                                                            rounded={'full'}
                                                            cursor="pointer"
                                                        />
                                                    }
                                                >
                                                    <Image
                                                        src={`${backendUrl}/avatars/${user.avatar}`}
                                                        alt="Stored Image"
                                                        boxSize="200px"
                                                        borderRadius="full"
                                                        fit="cover"
                                                        cursor="pointer"
                                                    />
                                                </Show>
                                            </Box>
                                            <Box
                                                w="100%"
                                                my={5}
                                            >
                                                <Text fontSize={"3xl"} justifySelf={"center"} textAlign={"center"} fontWeight={"extrabold"}>{user?.firstName} {user?.lastName}</Text>
                                                <Text fontSize={"xl"} justifySelf={"center"} textAlign={"center"}>{user?.username}</Text>
                                            </Box>
                                            <Show when={user?.professionalHeadline && user.professionalHeadline !== ''}>
                                                <Box>
                                                    <Text fontSize={"md"} justifySelf={"start"} textAlign={"justify"}>{user?.professionalHeadline}</Text>
                                                </Box>
                                            </Show>
                                            <Stack my={5} w="100%" gap={2}>
                                                <Show when={user?.email && user.email !== ''}>
                                                    <Flex align="center" visibility={user?.email}>
                                                        <MdEmail />
                                                        <Text fontSize={"md"} ml={2}>
                                                            {user?.email}
                                                        </Text>
                                                    </Flex>
                                                </Show>
                                                <Show when={user?.location && user.location !== ''}>
                                                    <Flex align="center" >
                                                        <BsGlobe2 />
                                                        <Text fontSize={"md"} ml={2}>
                                                            {user?.location}
                                                        </Text>
                                                    </Flex>
                                                </Show>
                                                <Show when={user?.telephone && user.telephone !== ''}>
                                                    <Flex align="center" >
                                                        <BsTelephoneFill />
                                                        <Text fontSize={"md"} ml={2}>
                                                            {user?.telephone}
                                                        </Text>
                                                    </Flex>
                                                </Show>
                                            </Stack>
                                            <Show when={user?.summary && user.summary !== ''}>
                                                <Separator variant={"solid"} style={{ color: "white" }} />
                                                <Box w="100%" mt={2} mb={5}>
                                                    <Text fontSize={"xl"} fontWeight={"medium"} mb={3}>Summary</Text>
                                                    <Text textAlign={"justify"}>{truncatedSummary}</Text>
                                                    <Show when={shouldExpand}>
                                                        <Text
                                                            mt={2}
                                                            cursor="pointer"
                                                            textDecoration="none"
                                                            _hover={{ textDecoration: "underline" }}
                                                            color={colorMode === "light" ? "cyan.600" : "pink.600"}
                                                            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={1}
                                                        >
                                                            <span style={{ marginRight: '5px' }}>
                                                                {isSummaryExpanded ? "Show Less" : "Show More"}
                                                            </span>
                                                            <Show 
                                                                when={isSummaryExpanded} 
                                                                fallback={
                                                                    <span>
                                                                        <SlArrowDown />
                                                                    </span>
                                                                }
                                                            >
                                                                <span>
                                                                    <SlArrowUp />
                                                                </span>
                                                            </Show>
                                                        </Text>
                                                    </Show>
                                                </Box>
                                            </Show>
                                            <Show when={userSocialMedia && userSocialMedia.length > 0}>
                                                <Separator variant={"solid"} style={{ color: "white" }} />
                                                <Box w="100%" mt={2}>
                                                    <Text fontSize={"xl"} fontWeight={"medium"} mb={3}>Social Media</Text>
                                                    <Flex 
                                                        gap={4}
                                                        display="grid" 
                                                        gridTemplateColumns="repeat(12, 1fr)"
                                                        gridAutoRows="auto"
                                                    >
                                                        <For
                                                            each={userSocialMedia}
                                                        >
                                                            {(item: UserSocialNetwork) => {
                                                                return (
                                                                    <IconsSocialMedia key={item.userSocialNetworkId} socialNetwork={item.network} link={item.link} size={'lg'} />
                                                                )
                                                            }}
                                                        </For>
                                                    </Flex>
                                                </Box>
                                            </Show>
                                        </Stack>
                                    </Box>
                                </GridItem>
                            </motion.div>
                        </Show>
                    </AnimatePresence>
                    <GridItem
                        style={{ gridColumn: isUserInfoVisible ? "2 / 3" : "1 / 2" }}
                        w={"full"}
                    >
                        <Stack gap="5" align="flex-start">
                            <Flex gap="3" direction={"row"} mb={0} justifyContent="space-between" width="100%">
                                <Text alignSelf={"center"} fontSize={"3xl"} fontWeight={"medium"}>ArtWorks</Text>
                                <Button
                                    size="xs"
                                    bg={colorMode === "light" ? "cyan.600" : "pink.600"}
                                    color={"white"}
                                    shadow={"lg"}
                                    onClick={handleNavigateNewArt}
                                    borderRadius={"md"}
                                >
                                    <FaPlusSquare /> New ArtWork
                                </Button>
                            </Flex>
                            <Box
                                bg={colorMode === 'light' ? "whiteAlpha.950" : "blackAlpha.500"}
                                rounded={"lg"}
                                shadow={"lg"}
                                p={7}
                                w={"full"}
                                overflowY={"clip"}
                            >
                                <Show 
                                    when={artworks && artworks.length > 0} 
                                    fallback={
                                        <Empty
                                            title="Oooh no!... You don't have any ArtWork created yet 😢"
                                            default_description={false}
                                        />
                                    }
                                >
                                    <Grid 
                                        templateRows="repeat(auto, auto)"
                                        templateColumns="repeat(7, 1fr)" 
                                        gap={1}
                                    >
                                        <For each={artworks}>
                                            {(artwork: Artwork) => (
                                                <ArtworkItem 
                                                    key={artwork.artworkId}
                                                    artwork={artwork}
                                                    isOpen={openMenuId === artwork.artworkId}
                                                    onMenuToggle={handleMenuOpen}
                                                />
                                            )}
                                        </For>
                                    </Grid>
                                </Show>
                            </Box>
                        </Stack>
                    </GridItem>
                </Grid>
                <Flex>
                    <Show when={!isUserInfoVisible}>
                        <Tooltip
                            content="Unhide Profile"
                            openDelay={500}
                            closeDelay={100}
                            unmountOnExit={true}
                            lazyMount={true}
                            positioning={{ placement: 'top-end' }}
                            showArrow
                            contentProps={{
                                css: {
                                    '--tooltip-bg': colorMode === 'light' ? 'colors.cyan.600' : 'colors.pink.600',
                                    'color': 'white',
                                },
                            }}
                        >
                            <IconButton
                                position="fixed"
                                aria-label="Show Info"
                                onClick={() => setIsUserInfoVisible(true)}
                                size="lg"
                                colorScheme="black"
                                shadow="md"
                                borderRadius="full"
                                bg={colorMode === "light" ? "black" : "white"}
                                color={colorMode === "light" ? "pink.600" : "cyan.600"}
                                left="20px"
                                bottom="75px"
                                zIndex="tooltip"
                            >
                                <IoEye />
                            </IconButton>
                        </Tooltip>
                    </Show>
                </Flex>
            </Box>
        </Show>
    )
}

export default Profile;