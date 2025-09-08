import { Flex, Card, Button, Field, Input, Stack } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { useColorMode } from "@/components/ui/color-mode";
import NotificationAlert from "@/custom/Components/NotificationAlert";

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

const SignUp = () => {
    const { signup, loading, isAuthenticated, error, clearError } = useAuth();
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const { colorMode } = useColorMode();

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
        getValues 
    } = useForm<FormValues>();

    const onSubmit = handleSubmit(async (data: any) => {
        await signup(data.firstName, data.lastName, data.email, data.username, data.password);
    });

    return (
        <Flex 
            minH="100vh" 
            align="center" 
            justify="center"
        >
            <Card.Root 
                w={{ base: "90%", md: "500px" }}
                shadow="lg" 
                borderRadius="lg"
            >
                <Card.Header>
                    <Card.Title>Sign Up</Card.Title>
                    <Card.Description>Welcome! Sign Up to start</Card.Description>
                </Card.Header>
                <Card.Body>
                    <form onSubmit={onSubmit}>
                        <Stack gap="4" align="flex-start">
                            <Field.Root invalid={!!errors.firstName}>
                                <Field.Label>First Name</Field.Label>
                                <Input {...register("firstName", { required: "First Name is required" })} />
                                <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.lastName}>
                                <Field.Label>Last Name</Field.Label>
                                <Input {...register("lastName", { required: "Last Name is required" })} />
                                <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.email}>
                                <Field.Label>E-mail</Field.Label>
                                <Input 
                                    {...register("email", { 
                                        required: "E-mail is required", 
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                                            message: "Invalid e-mail format"
                                        } 
                                    })} 
                                />
                                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                            </Field.Root>

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
                                <PasswordInput 
                                    {...register("password", {
                                        required: "Password is required",
                                        validate: value => value === getValues("confirmPassword") || "Passwords must match"
                                    })}
                                />
                                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.confirmPassword}>
                                <Field.Label>Confirm Password</Field.Label>
                                <PasswordInput 
                                    {...register("confirmPassword", { 
                                        required: "Confirm Password is required" ,
                                        validate: value => value === getValues("password") || "Passwords must match"
                                    })}
                                />
                                <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
                            </Field.Root>

                            <Button 
                                type="submit" 
                                alignSelf={"flex-end"} 
                                bg={"cyan.600"} 
                                color={"white"}
                                loading={loading}
                                disabled={loading}
                            >
                                <BsPersonFillAdd /> Sing Up
                            </Button>
                        </Stack>
                    </form>
                </Card.Body>
                <Card.Footer alignSelf={"center"}>
                    <Stack align="center">
                        <Card.Description>Already have an account?</Card.Description>
                        <Button color={"white"} bg={colorMode === "light" ? "blackAlpha.800":""} onClick={() => navigate("/signin")} size={"xs"}>
                            Sign In Here
                        </Button>
                    </Stack>
                </Card.Footer>
            </Card.Root>
            {showAlert && error?.message && (
                <NotificationAlert
                    type="error"
                    title="Sign Up Error"
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

export default SignUp;
