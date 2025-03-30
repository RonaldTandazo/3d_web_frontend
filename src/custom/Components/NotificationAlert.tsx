import { Alert, CloseButton, Presence, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";

interface AlertProps {
    type: "error" | "success" | "warning" | "info";
    title: string;
    message: string;
    onClose: () => void;
}

const NotificationAlert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
    const { open, onOpen, onToggle } = useDisclosure();

    useEffect(() => {
        if (message) {
            onOpen();
        }
    }, [message, onOpen]);

    const handleClose = () => {
        onToggle();

        setTimeout(() => {
            onClose();
        }, 1000);
    };

    return (
        <Presence
            present={open}
            animationName={{ _open: "fade-in", _closed: "fade-out" }}
            animationDuration="slower"
        >
            <Alert.Root 
                maxW={"20vw"}
                status={type}
                position="fixed"
                top="85px"
                right="20px"
                zIndex={"tooltip"}
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
                    onClick={handleClose}
                />
            </Alert.Root>
        </Presence>
    );
};

export default NotificationAlert;
