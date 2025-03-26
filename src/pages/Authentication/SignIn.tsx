import { Flex, Card, Button, Field, Input, Stack } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogIn } from "react-icons/bi";
import { useColorMode } from "@/components/ui/color-mode";
import NotificationAlert from "@/custom/Components/NotificationAlert";
import LoadignScreen from "@/custom/Templates/LoadingScreen";

interface FormValues {
    username: string;
    password: string;
}

const SignIn = () => {
    const { login, loading, isAuthenticated, error, clearError } = useAuth();
    const { colorMode } = useColorMode();
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error?.message) {
            setShowAlert(true);
        }
    }, [error]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = handleSubmit(async (data: any) => {
        await login(data.username, data.password);
    });

    return (
        <Flex 
            h="100vh" 
            align="center" 
            justify="center"
        >
            <Card.Root 
                w={{ base: "90%", md: "500px" }} // Ancho responsivo
                shadow="lg" 
                borderRadius="lg"
            >
                <Card.Header>
                    <Card.Title>Login</Card.Title>
                    <Card.Description>Welcome! Sign In to continue</Card.Description>
                </Card.Header>
                <Card.Body>
                    <form onSubmit={onSubmit}>
                        <Stack gap="4" align="flex-start">
                            <Field.Root invalid={!!errors.username}>
                                <Field.Label>Username</Field.Label>
                                <Input 
                                    {...register("username", { 
                                        required: "Username is required", 
                                    })} 
                                />
                                <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.password}>
                                <Field.Label>Password</Field.Label>
                                <PasswordInput {...register("password", { required: "Password is required" })} />
                                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                            </Field.Root>

                            <Button 
                                type="submit" 
                                alignSelf={"flex-end"} 
                                bg={"cyan.600"} 
                                color={"white"}
                                loading={loading}
                                disabled={loading}
                            >
                                <BiLogIn />Sign In
                            </Button>
                        </Stack>
                    </form>
                </Card.Body>
                <Card.Footer alignSelf={"center"}>
                    <Stack align="center">
                        <Card.Description>Don't have an account?</Card.Description>
                        <Button color={"white"} bg={colorMode === "light" ? "blackAlpha.800":""} onClick={() => navigate("/signup")} size={"xs"}>
                            Sign Up Here
                        </Button>
                    </Stack>
                </Card.Footer>
            </Card.Root>
            {showAlert && error?.message && (
                <NotificationAlert
                    type="error"
                    title="Sign In Error"
                    message={error.message}
                    onClose={() => {
                        clearError()
                        setShowAlert(false);
                    }}
                />
            )}
        </Flex>
    );
};

export default SignIn;
