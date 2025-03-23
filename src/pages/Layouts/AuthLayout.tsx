import { useColorMode } from "@/components/ui/color-mode";
import ArtVerseButton from "@/custom/FloatingButtons/ArtVerseButton";
import ThemeButton from "@/custom/FloatingButtons/ThemeButton";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    const { colorMode } = useColorMode();

    return (
        <Box 
            h="100vh"
            w="100vw"
            bg={colorMode === "light" ? "gray.100" : "gray.950"}
        >
            <ThemeButton />
            <ArtVerseButton />

            <Outlet />
        </Box>
    );
};

export default AuthLayout;
