import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { Box, Button, Flex, Icon, IconButton, Input, InputGroup, ProgressCircle } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { BsFillPersonVcardFill, BsPencilSquare, BsSearch } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const { colorMode } = useColorMode();
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, isAuthenticated, loading  } = useAuth();
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
            <IconButton
                aria-label="Personal Profile"
                rounded="full"
                size="md"
                onClick={() => navigate(`/Profile/${user.username}`)}
                bg={colorMode === "light" ? "cyan.500":"pink.500"}
            >
                <Icon 
                    size="xl"
                    color={colorMode === "light" ? "white":"black"}
                >
                    <VscAccount />
                </Icon>
            </IconButton>
        );
    }

    return (
        <Box 
            as="nav" 
            bg={colorMode === "light" ? "gray.100" : "gray.950"}
            position="sticky" 
            top="0" 
            p={5}
            zIndex="sticky" 
            shadow={isScrolled ? "md" : "none"}
            transition="box-shadow 0.3s ease"
        >
            <Flex align="center" mx="auto" justifyContent="space-between">
                <Box fontSize="xl" fontWeight="bold">Mi Logo</Box>

                <Box flex="1" maxW="60vw" mx={4}>
                    <InputGroup flex="1" startElement={<BsSearch />}>
                        <Input 
                            placeholder="What are you looking for?..." 
                            borderRadius="full" 
                            size="lg" 
                            borderColor={colorMode === 'light' ? "blackAlpha.700":"whiteAlpha.700"}
                        />
                    </InputGroup>
                </Box>

                <Flex>{authButtons}</Flex>
            </Flex>
        </Box>
    )
}

export default NavBar