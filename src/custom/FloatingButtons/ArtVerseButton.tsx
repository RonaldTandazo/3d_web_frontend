import { IconButton } from "@chakra-ui/react";
import { GiAtomicSlashes } from "react-icons/gi";
import { useColorMode } from "@/components/ui/color-mode";
import { useNavigate } from "react-router-dom";

const ArtVerseButton = () => {
    const { colorMode } = useColorMode();
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/")
    }

    return (
        <IconButton
            aria-label="Go Artverse"
            position="fixed"
            left="20px"
            bottom="20px"
            onClick={handleNavigate}
            size="lg"
            colorScheme="black"
            shadow="md"
            borderRadius="full"
            bg={colorMode === "light" ? "black" : "white"}    
            color={colorMode === "light" ? "pink.500" : "cyan.500"}
            zIndex="tooltip"
        >
            <GiAtomicSlashes />
        </IconButton>
    );
}

export default ArtVerseButton;