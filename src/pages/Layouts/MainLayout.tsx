import { useEffect, useState } from "react";
import { Box, Button, Container, Flex, Input, InputGroup, Text } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { BsFillPersonVcardFill, BsPencilSquare, BsSearch } from "react-icons/bs";
import { Outlet, useNavigate } from "react-router-dom";
import FloatingButton from "@/custom/components/FloatingButton";
import { useAuth } from "@/context/AuthContext";

const MainLayout = () => {
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
            minH="100vh" 
            w="100vw" 
            bg={colorMode === "light" ? "gray.100" : "gray.900"}
            color={colorMode === "light" ? "black" : "white"}
            display="flex" 
            flexDirection="column"
        >
            <Box 
                as="nav" 
                py={5} 
                px={5} 
                bg={colorMode === "light" ? "gray.100" : "gray.900"}
                position="sticky" 
                top="0" 
                zIndex="sticky" 
                shadow={isScrolled ? "md" : "none"}
                transition="box-shadow 0.3s ease"
            >
                <Flex align="center" maxW="99.5%" mx="auto" justifyContent="space-between">
                    {/* Logo totalmente a la izquierda */}
                    <Box fontSize="xl" fontWeight="bold">Mi Logo</Box>

                    {/* Barra de búsqueda centrada */}
                    <Box flex="1" maxW="60%" mx={4}>
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

            <FloatingButton />

            <Container 
                maxW="100%"
                px="0%"
                flex="1"
                bg={colorMode === "light" ? "gray.100" : "gray.900"}
            >
                <Outlet />
            </Container>
        </Box>
    );
};

export default MainLayout;
