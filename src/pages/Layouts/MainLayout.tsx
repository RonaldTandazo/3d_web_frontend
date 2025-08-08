import { Box, Show } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { Outlet, useLocation } from "react-router-dom";
import ThemeButton from "@/custom/FloatingButtons/ThemeButton";
import NavBar from "@/custom/Components/NavBar";
import ArtVerseButton from "@/custom/FloatingButtons/ArtVerseButton";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/custom/Templates/LoadingScreen";

const MainLayout = () => {
    const { loading } = useAuth();
    const { colorMode } = useColorMode();
    const location = useLocation();
    const excludedRoutes = ['/'];
    const shouldShowButton = !excludedRoutes.includes(location.pathname);

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
                color={colorMode === "light" ? "black" : "white"}
                overflowY="auto"
                pb={5}
            >
                    <NavBar />
                    <ThemeButton />
                    <Show
                        when={shouldShowButton}
                    >
                        <ArtVerseButton />
                    </Show>
                    <Box mt={5} mx={5} h={"90dvh"}>
                        <Outlet />
                    </Box>
            </Box>
        </Show>
    );
};

export default MainLayout;