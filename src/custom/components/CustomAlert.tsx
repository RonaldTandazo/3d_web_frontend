import { Alert, CloseButton, Presence, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

interface AlertProps {
    type: "error" | "success" | "warning" | "info";
    title: string;
    message: string;
    onClose: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
    const { open, onOpen, onToggle } = useDisclosure();

    useEffect(() => {
        if (message) {
            onOpen();
        }
    }, [message, onOpen]);

    return (
        <Presence
            present={open}
            animationName={{ _open: "fade-in", _closed: "fade-out" }}
            animationDuration="moderate"
        >
            <Alert.Root 
                status={type}
            >
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>{title}</Alert.Title>
                    <Alert.Description>
                        {message}
                    </Alert.Description>
                </Alert.Content>
                <CloseButton 
                    pos="relative" 
                    top="-2" 
                    insetEnd="-2"
                    onClick={() => {
                        onToggle()
                        onClose()
                    }}
                />
            </Alert.Root>
        </Presence>
    );
};

export default CustomAlert;
