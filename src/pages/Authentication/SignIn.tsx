import { Flex, Card, Button, Field, Input, Stack, Checkbox } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogIn } from "react-icons/bi";
import { useColorMode } from "@/components/ui/color-mode";
import NotificationAlert from "@/custom/Components/NotificationAlert";

interface FormValues {
    username: string;
    password: string;
    rememberMe: boolean;
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
        control
    } = useForm<FormValues>({
        defaultValues: {
            rememberMe: false
        }
    });

    const onSubmit = handleSubmit(async (data: FormValues) => {
        await login(data.username, data.password, data.rememberMe);
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
                            
                            <Stack
                                w={"full"}
                                direction={"row"} 
                                justifyContent={"space-between"}
                                alignItems={"center"}
                            >
                                <Controller
                                    control={control}
                                    name="rememberMe"
                                    render={({ field }) => (
                                        <Field.Root>
                                            <Checkbox.Root
                                                checked={field.value}
                                                onCheckedChange={({ checked }) => field.onChange(checked)}
                                            >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control />
                                                <Checkbox.Label>Keep Sign In</Checkbox.Label>
                                            </Checkbox.Root>
                                        </Field.Root>
                                    )}
                                />

                                <Button 
                                    type="submit" 
                                    bg={"cyan.600"} 
                                    color={"white"}
                                    loading={loading}
                                    disabled={loading}
                                >
                                    <BiLogIn />Sign In
                                </Button>
                            </Stack>
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
