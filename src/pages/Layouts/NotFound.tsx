import FloatingButton from "@/custom/components/FloatingButton";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Box 
            minH="100vh" 
            minW="98vw"
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center"
            textAlign="center"
            p={10}
        >
            <Heading fontSize="6xl">404</Heading>
            <Text fontSize="xl" mt={4}>Oops... Page Not Found. It looks like you’re lost!</Text>
            <Text fontSize="xl" >Don’t worry, we’ll get you back!</Text>

            <Button color={"white"} bg={"cyan.500"} onClick={() => navigate("/")} size={"md"} mt={6}>
                Go to ArtVerse
            </Button>

            <FloatingButton />
        </Box>
    );
};

export default NotFoundPage;
