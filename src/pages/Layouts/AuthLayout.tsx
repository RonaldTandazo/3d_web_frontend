import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import ArtVerseButton from "@/custom/FloatingButtons/ArtVerseButton";
import ThemeButton from "@/custom/FloatingButtons/ThemeButton";
import LoadingScreen from "@/custom/Templates/LoadingScreen";
import { Box, Show } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    const { loading } = useAuth();
    const { colorMode } = useColorMode();

    return (
        <Show
            when={!loading}
            fallback={
                <LoadingScreen />
            }
        >
            <Box 
                h={"100dvh"}
                w={"100dvw"}
                bg={colorMode === "light" ? "gray.100" : "gray.950"}
            >
                <ThemeButton />
                <ArtVerseButton />

                <Outlet />
            </Box>
        </Show>
    );
};

export default AuthLayout;
