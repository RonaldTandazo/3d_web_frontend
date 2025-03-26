import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import ArtVerseButton from "@/custom/FloatingButtons/ArtVerseButton";
import DecorativeBox from "@/custom/Templates/DecorativeBox";
import { Box, Flex, Grid, GridItem, Icon, Image, Link, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsGlobe2, BsTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Profile = () => {
    const { colorMode } = useColorMode();
    const { user } = useAuth();
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

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

    return (
        <Box h={"auto"} maxW={"100vw"}>
            <Grid
                templateRows="repeat(auto, auto)"
                templateColumns="1fr 4fr"
                maxW={"100vw"}
                gap={10}
            >
                <GridItem
                    bg={colorMode === 'light' ? "whiteAlpha.950":"blackAlpha.500"}
                    borderRadius={"lg"}
                    shadow={"lg"}
                    py={10}
                    px={10}
                >
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
                            <Text fontSize={"3xl"} justifySelf={"center"} fontWeight={"extrabold"}>{user?.firstName} {user?.lastName}</Text>
                            <Text fontSize={"xl"} justifySelf={"center"}>{user?.username}</Text>
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
                                <hr style={{ color: "white" }} />
                                <Box w="100%" mt={2} mb={5}>
                                    <Text fontSize={"xl"} fontWeight={"medium"} mb={3}>Summary</Text>
                                    <Text textAlign={"justify"}>{truncatedSummary}</Text>
                                    {shouldExpand && (
                                        <Text
                                            mt={2}
                                            cursor="pointer"
                                            textDecoration="none"
                                            _hover={{ textDecoration: "underline" }}
                                            color={colorMode === "light" ? "pink.500" : 'cyan.500'}
                                            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            <span style={{ marginRight: '5px' }}>
                                                {isSummaryExpanded ? "Show Less" : "Show More"}
                                            </span>
                                            {isSummaryExpanded ? (
                                                <span style={{ textDecoration: 'underline' }}>
                                                    <SlArrowUp />
                                                </span>
                                            ) : (
                                                <span style={{ textDecoration: 'underline' }}>
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
                                <hr style={{ color: "white" }} />
                                <Box w="100%" mt={2}>
                                    <Text fontSize={"xl"} fontWeight={"medium"} mb={3}>Social Media</Text>
                                    <Flex gap={4}>
                                        {Object.entries(user.socialMedia).map(([platform, url]) => (
                                            <Link href={url} key={platform}>
                                                <Icon boxSize={6} color={colorMode === "light" ? "pink.500":"cyan.500"}>
                                                    {socialMediaIcons[platform as SocialMediaPlatform]}
                                                </Icon>
                                            </Link>
                                        ))}
                                    </Flex>
                                </Box>
                            </>
                        )}
                    </Stack>
                </GridItem>
                <GridItem>
                    <Stack gap="5" align="flex-start">
                        <Flex gap="3" direction={"row"} mb={0}>
                            <Text fontSize={"3xl"} alignSelf={"center"}>Artworks</Text>
                        </Flex>
                        <DecorativeBox name={"dashboard"} image={null}/>
                    </Stack>
                </GridItem>
            </Grid>
            <ArtVerseButton />
        </Box>
    )   
}

export default Profile;