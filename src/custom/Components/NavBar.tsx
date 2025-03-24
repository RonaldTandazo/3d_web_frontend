import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { Box, Button, Flex, Input, InputGroup, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { BsFillPersonVcardFill, BsPencilSquare, BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const { colorMode } = useColorMode();
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAuthenticated } = useAuth();
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
                {/* Logo totalmente a la izquierda */}
                <Box fontSize="xl" fontWeight="bold">Mi Logo</Box>

                {/* Barra de búsqueda centrada */}
                <Box flex="1" maxW="60vw" mx={4}>
                    <InputGroup flex="1" startElement={<BsSearch />}>
                        <Input placeholder="Search..." borderRadius="full" size="lg" borderColor={colorMode === 'light' ? "blackAlpha.700":"whiteAlpha.700"}/>
                    </InputGroup>
                </Box>

                {/* Botones totalmente a la derecha */}
                <Flex>
                    {!isAuthenticated ? (
                        <>
                        <Button 
                            mr={3} 
                            bg={colorMode === "light" ? "blackAlpha.700" : "white"} 
                            color={colorMode === "light" ? "white" : "black"} 
                            onClick={() => navigate("/signup")}
                        >
                            <BsPencilSquare/> Sign Up
                        </Button>
                        <Button 
                            bg={colorMode === "light" ? "cyan.600" : "cyan.600"} 
                            color={"white"} 
                            onClick={() => navigate("/signin")}
                        >
                            <BsFillPersonVcardFill /> Sign In
                        </Button>
                        </>
                    ) : (
                        <Text>Welcome back!</Text>
                    )}
                </Flex>
            </Flex>
        </Box>
    )
}

export default NavBar