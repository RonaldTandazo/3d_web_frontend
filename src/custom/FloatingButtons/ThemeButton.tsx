import { IconButton } from "@chakra-ui/react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { useColorMode } from "@/components/ui/color-mode";

const ThemeButton = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    
    return (
        <IconButton
            aria-label="Toggle dark mode"
            position="fixed"
            bottom="20px"
            right="20px"
            onClick={toggleColorMode}
            size="lg"
            colorScheme="black"
            shadow="md"
            borderRadius="full"
            bg={colorMode === "light" ? "black" : "white"}    
            color={colorMode === "light" ? "white" : "black"}
            zIndex="tooltip"
        >
            {colorMode === 'light' ? <BsFillMoonFill />:<BsFillSunFill/> }
        </IconButton>
    );
}

export default ThemeButton;