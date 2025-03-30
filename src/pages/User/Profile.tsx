import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { Box, Button, Flex, Grid, GridItem, Icon, IconButton, Image, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsGlobe2, BsTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FaFacebook, FaInstagram, FaPlusSquare, FaTwitter, FaUserEdit, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { colorMode } = useColorMode();
    const { user } = useAuth();
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [isUserInfoVisible, setIsUserInfoVisible] = useState(true);
    const navigate = useNavigate();

    user.professionalHeadline = '3D Modeler, and Fullstack Developer'
    user.summary = 'I have a hobby to model vehicles, and rarely make sculptures of characters. I practice to improve my skills and knowledge day by day, to have better results.'
    user.location = 'Guayaquil, Ecuador'
    user.telephone = '+593 0962618451'
    user.socialMedia = {
        facebook: "https://www.facebook.com",
        instagram: "https://www.instagram.com",
        twitter: "https://www.x.com",
        youtube: "https://www.youtube.com"
    }

    const charsPerLine = 50;
    const maxLines = 2;
    const estimatedLines = Math.ceil(user?.summary.length / charsPerLine);
    const shouldExpand = user?.summary && estimatedLines > maxLines;

    const truncatedSummary = shouldExpand && !isSummaryExpanded
        ? user.summary.slice(0, maxLines * charsPerLine) + '...'
        : user?.summary;

    type SocialMediaPlatform = 'facebook' | 'instagram' | 'twitter' | 'youtube';

    const socialMediaIcons = {
        facebook: <FaFacebook />,
        instagram: <FaInstagram />,
        twitter: <FaTwitter />,
        youtube: <FaYoutube />
    };

    const artworks = [
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        "https://bit.ly/naruto-sage",
        // ... más URLs de imágenes
    ];

    const handleNavigate = () => {
        if(user && user?.username){
            navigate(`/ProfileSettings/${user.username}`)
        }
    }

    return (
        <Box h={"auto"} mx={5}>
            <Grid
                templateColumns={isUserInfoVisible ? "1fr 4fr" : "1fr"}
                maxW={"100vw"}
                gap={10}
                alignItems={"start"}
            >
                <AnimatePresence>
                    {isUserInfoVisible && (
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
                            >
                                <Box position="relative" width={"100%"}>
                                    <IconButton
                                        onClick={() => setIsUserInfoVisible(false)}
                                        borderRadius="full"
                                        colorScheme="black"
                                        size="sm"
                                        bg={"transparent"}
                                        color={colorMode === "light" ? "cyan.500":"pink.500" }
                                        position="absolute"
                                        top="-20px"
                                        left="-20px"
                                    >
                                        <IoEyeOff />
                                    </IconButton>
                                    <IconButton
                                        borderRadius="full"
                                        colorScheme="black"
                                        size="sm"
                                        bg={"transparent"}
                                        color={colorMode === "light" ? "cyan.500":"pink.500"}
                                        position="absolute"
                                        top="-20px"
                                        right="-20px"
                                        onClick={handleNavigate}
                                    >
                                        <FaUserEdit />
                                    </IconButton>
                                    <Stack>
                                        <Box 
                                            w="100%"
                                            display={"flex"}
                                            justifyContent="center" 
                                            alignItems="center"
                                        >
                                            <Image
                                                src="https://bit.ly/naruto-sage"
                                                boxSize="175px"
                                                borderRadius="full"
                                                fit="cover"
                                                alt="Naruto Uzumaki"
                                            />
                                        </Box>
                                        <Box 
                                            w="100%"
                                            my={5}
                                        >
                                            <Text fontSize={"3xl"} justifySelf={"center"} textAlign={"center"} fontWeight={"extrabold"}>{user?.firstName} {user?.lastName}</Text>
                                            <Text fontSize={"xl"} justifySelf={"center"} textAlign={"center"}>{user?.username}</Text>
                                        </Box>
                                        <Box>
                                            {user?.professionalHeadline && user.professionalHeadline !== '' && (
                                                <Text fontSize={"md"} justifySelf={"start"} textAlign={"justify"}>{user.professionalHeadline}</Text>
                                            )}
                                        </Box>
                                        <Flex my={5} w="100%" gap={2} direction={"column"}> 
                                            {user?.email && user.email !== '' && (
                                                <Flex align="center" visibility={user?.email}>
                                                    <MdEmail /> 
                                                    <Text fontSize={"md"} ml={2}> 
                                                        {user?.email}
                                                    </Text>
                                                </Flex>
                                            )}
                                            {user?.location && user.location !== '' && (
                                                <Flex align="center" >
                                                    <BsGlobe2 />
                                                    <Text fontSize={"md"} ml={2}> 
                                                        {user?.location}
                                                    </Text>
                                                </Flex>
                                            )}
                                            {user?.telephone && user.telephone !== '' && (
                                                <Flex align="center" >
                                                    <BsTelephoneFill />
                                                    <Text fontSize={"md"} ml={2}> 
                                                        {user?.telephone}
                                                    </Text>
                                                </Flex>
                                            )}
                                        </Flex>
                                        {user?.summary && user.summary !== '' && (
                                            <>
                                                <Separator variant={"solid"} style={{ color: "white" }} />
                                                <Box w="100%" mt={2} mb={5}>
                                                    <Text fontSize={"xl"} fontWeight={"medium"} mb={3}>Summary</Text>
                                                    <Text textAlign={"justify"}>{truncatedSummary}</Text>
                                                    {shouldExpand && (
                                                        <Text
                                                            mt={2}
                                                            cursor="pointer"
                                                            textDecoration="none"
                                                            _hover={{ textDecoration: "underline" }}
                                                            color={colorMode === "light" ? "cyan.500":"pink.500"}
                                                            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={1}
                                                        >
                                                            <span style={{ marginRight: '5px' }}>
                                                                {isSummaryExpanded ? "Show Less" : "Show More"}
                                                            </span>
                                                            {isSummaryExpanded ? (
                                                                <span>
                                                                    <SlArrowUp />
                                                                </span>
                                                            ) : (
                                                                <span>
                                                                    <SlArrowDown />
                                                                </span>
                                                            )}
                                                        </Text>
                                                    )}
                                                </Box>
                                            </>
                                        )}
                                        {user?.socialMedia && Object.keys(user.socialMedia).length > 0 && (
                                            <>
                                                <Separator variant={"solid"} style={{ color: "white" }} />
                                                <Box w="100%" mt={2}>
                                                    <Text fontSize={"xl"} fontWeight={"medium"} mb={3}>Social Media</Text>
                                                    <Flex gap={4}>
                                                        {Object.entries(user.socialMedia).map(([platform, url]) => (
                                                            <Link href={url} key={platform}>
                                                                <Icon boxSize={6} color={colorMode === "light" ? "cyan.500":"pink.500"}>
                                                                    {socialMediaIcons[platform as SocialMediaPlatform]}
                                                                </Icon>
                                                            </Link>
                                                        ))}
                                                    </Flex>
                                                </Box>
                                            </>
                                        )}
                                    </Stack>
                                </Box>
                            </GridItem>
                        </motion.div>
                    )}
                </AnimatePresence>
                <GridItem
                    style={{ gridColumn: isUserInfoVisible ? "2 / 3" : "1 / 2" }}
                >
                    <Stack gap="5" align="flex-start">
                        <Flex gap="3" direction={"row"} mb={0} justifyContent="space-between" width="100%">
                            <Text alignSelf={"center"} fontSize={"3xl"} fontWeight={"medium"}>Artworks</Text>
                            <Button 
                                size="xs" 
                                bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                color={"white"}
                                shadow={"lg"}
                            >
                                <FaPlusSquare /> New Artwork
                            </Button>
                        </Flex>
                        <Box 
                            bg={colorMode === 'light' ? "whiteAlpha.950":"blackAlpha.500"}
                            rounded={"lg"}
                            shadow={"lg"}
                            p={7}
                        >
                            <Grid templateColumns="repeat(6, 1fr)" gap={4}>
                                {artworks.map((artwork, index) => (
                                    <GridItem key={index} w="100%" h="auto">
                                        <Image src={artwork} alt={`Artwork ${index}`} w="100%" h="auto" borderRadius="md" />
                                    </GridItem>
                                ))}
                            </Grid>
                        </Box>
                    </Stack>
                </GridItem>
            </Grid>
            <Flex>
                {!isUserInfoVisible && (
                    <IconButton 
                        position="fixed"
                        aria-label="Show Info"
                        onClick={() => setIsUserInfoVisible(true)}
                        size="lg"
                        colorScheme="black"
                        shadow="md"
                        borderRadius="full"
                        bg={colorMode === "light" ? "black" : "white"} 
                        color={colorMode === "light" ? "pink.500" : "cyan.500"}
                        left="20px"
                        bottom="75px"
                        zIndex="tooltip"
                    >
                        <IoEye />
                    </IconButton>
                )}
            </Flex>
        </Box>
    )   
}

export default Profile;