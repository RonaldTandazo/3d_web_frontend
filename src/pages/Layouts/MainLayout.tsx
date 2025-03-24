import { Box } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Outlet } from "react-router-dom";
import ThemeButton from "@/custom/FloatingButtons/ThemeButton";
import NavBar from "@/custom/Components/NavBar";

const MainLayout = () => {
    const { colorMode } = useColorMode();

    return (
        <Box 
            h="100vh"
            w="100vw"
            bg={colorMode === "light" ? "gray.100" : "gray.950"}
            color={colorMode === "light" ? "black" : "white"}
            overflowY="auto"
            px={5}
        >
            <NavBar />
            <ThemeButton />

            <Outlet />
        </Box>
    );
};

export default MainLayout;