import { IconButton } from "@chakra-ui/react";
import { GiAtomicSlashes } from "react-icons/gi";
import { useColorMode } from "@/components/ui/color-mode";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@/components/ui/tooltip";

const ArtVerseButton = () => {
    const { colorMode } = useColorMode();
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/")
    }

    return (
        <Tooltip
            content="Go to Artverse"
            openDelay={500}
            closeDelay={100}
            unmountOnExit={true}
            lazyMount={true}
            positioning={{ placement: 'top-end' }}
            showArrow
            contentProps={{
                css: {
                    '--tooltip-bg': colorMode === 'light' ? 'colors.cyan.500' : 'colors.pink.500',
                    'color': 'white',
                },
            }}
        >
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
        </Tooltip>
    );
}

export default ArtVerseButton;