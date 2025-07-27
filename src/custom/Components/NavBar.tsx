import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { Avatar, Box, Button, Flex, HStack, Icon, Input, InputGroup, Menu, Portal, ProgressCircle } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { BsFillPersonVcardFill, BsPencilSquare, BsSearch } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_API_URL;

const NavBar = () => {
    const { colorMode } = useColorMode();
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isAuthenticated, loading, logout  } = useAuth();
    const navigate = useNavigate();

    const handleScroll = () => {
        if (window.scrollY > 10) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    let authButtons;
    if (loading) {
        authButtons = (
            <ProgressCircle.Root value={null} size="sm">
                <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range />
                </ProgressCircle.Circle>
            </ProgressCircle.Root>
        );
    }else if(!isAuthenticated && !user) {
        authButtons = (
            <>
                <Button
                    mr={3}
                    bg={colorMode === "light" ? "blackAlpha.700" : "white"}
                    color={colorMode === "light" ? "white" : "black"}
                    onClick={() => navigate("/SignUp")}
                >
                    <BsPencilSquare /> Sign Up
                </Button>
                <Button
                    bg="cyan.600"
                    color="white"
                    onClick={() => navigate("/SignIn")}
                >
                    <BsFillPersonVcardFill /> Sign In
                </Button>
            </>
        );
    }else if(isAuthenticated && user){
        authButtons = (
            <Menu.Root lazyMount>
                <Menu.Trigger asChild>
                    <Button bg={"transparent"} color={"transparent"} borderRadius={"full"} width={"0px"}>
                        <Avatar.Root
                            key={"subtle"} 
                            variant={"subtle"}
                            cursor={"pointer"}
                        >
                            <Avatar.Fallback name={user?.username} />
                            <Avatar.Image src={`${backendUrl}/avatars/${user.avatar}`} />
                        </Avatar.Root>
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content zIndex={"toast"}>
                            <Menu.Item 
                                value="edit-profile" 
                                onClick={() => navigate(`/Profile/${user.username}`)} 
                                cursor={"pointer"}
                            >
                                <FaUser />
                                View Profile
                            </Menu.Item>
                            <Menu.Item 
                                value="sign-out" 
                                onClick={() => logout()} 
                                cursor={"pointer"}
                                color="fg.error"
                                _hover={{ bg: "bg.error", color: "fg.error" }}
                            >
                                <CiLogout />
                                Sign Out
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        )
    }

    return (
        <Box 
            as="nav" 
            bg={colorMode === "light" ? "cyan.500" : "pink.500"}
            position="sticky" 
            top="0" 
            p={5}
            zIndex="sticky" 
            shadow={isScrolled ? "md" : "none"}
            transition="box-shadow 0.3s ease"
        >
            <HStack align="center" mx="auto" justifyContent="space-between">
                <Box fontSize="xl" fontWeight="bold">Mi Logo</Box>

                <Box flex="1" maxW="60vw" mx={4}>
                    <InputGroup 
                        flex="1" 
                        startElement={
                            <Icon color={"whiteAlpha.950"}>
                                <BsSearch />
                            </Icon>
                        }
                        color={"whiteAlpha.950"}
                    >
                        <Input 
                            placeholder="What are you looking for?..."
                            _placeholder={{ color: "whiteAlpha.950" }} 
                            borderRadius="full" 
                            size="lg" 
                            borderColor={"whiteAlpha.950"}
                        />
                    </InputGroup>
                </Box>

                <Flex>{authButtons}</Flex>
            </HStack>
        </Box>
    )
}

export default NavBar