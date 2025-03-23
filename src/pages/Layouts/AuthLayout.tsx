import { useColorMode } from "@/components/ui/color-mode";
import FloatingButton from "@/custom/components/FloatingButton";
import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    const { colorMode } = useColorMode();

    return (
        <Box 
            h="100vh" 
            w="100vw" 
        >
            <FloatingButton />

            <Container 
                maxWidth={"100%"}
                flex="1"
                bg={colorMode === "light" ? "gray.100" : "gray.950"}
            >
                <Outlet />
            </Container>
        </Box>
    );
};

export default AuthLayout;
