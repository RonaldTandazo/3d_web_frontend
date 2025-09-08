import { useColorMode } from "@/components/ui/color-mode";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const { colorMode } = useColorMode()

    return (
        <Box 
            minH="100dvh"
            minW="100dvw"
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center"
            textAlign="center"
            p={10}
            color={colorMode == 'light' ? 'cyan.600':'pink.600'}
            bg={colorMode === "light" ? "gray.100" : "gray.950"}
        >
            <Heading fontSize="6xl">404</Heading>
            <Text fontSize="xl" mt={4}>Oops...Page Not Found. It looks like you’re lost!</Text>
            <Text fontSize="xl" >Don’t worry, we’ll get you back!</Text>

            <Button color={"white"} bg={"cyan.600"} onClick={() => navigate("/")} size={"md"} mt={6}>
                Go to ArtVerse
            </Button>
        </Box>
    );
};

export default NotFoundPage;
