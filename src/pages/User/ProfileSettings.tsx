import { useColorMode } from "@/components/ui/color-mode";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/context/AuthContext";
import { Box, Icon, Tabs, Text, Grid, GridItem, Image, Stack, Field, Button, Heading, Flex, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaUserTie } from "react-icons/fa";
import { ImProfile, ImUser } from "react-icons/im";
import { useChangePassword, useProfileUpdate } from "../../services/User/UserService";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoIosSave } from "react-icons/io";
import { PiShareNetworkFill } from "react-icons/pi";
import NotificationAlert from "@/custom/Components/NotificationAlert";
import SearchableSelect from "@/custom/Components/SeachableSelect";
import { useGetCountry } from "@/services/Country/CountryService";

interface ProfileFormValues {
    firstName: string;
    lastName: string;
    professionalHeadline: string;
    countryId: number;
    city: string;
} 

interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
} 

const ProfileSettings = () => {
    const [countries, setCountries] = useState([]);
    const { data: countryData, error: countryError, loading: countryLoading } = useGetCountry();
    const { changePassword: ChangePassword, data: passwordData, error: passwordError, loading: passwordLoading } = useChangePassword();
    const { profileUpdate: ProfileUpdate, data: profileData, error: profileError, loading: profileLoading } = useProfileUpdate();

    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState({message: "", type: ""});
    
    const [activeTab, setActiveTab] = useState<string | null>("1");
    const [since, setSince] = useState<string | null>(null);
    const { colorMode } = useColorMode();
    const { user } = useAuth();
    
    const opciones = {
        year: 'numeric',
        month: 'long',
    };

    useEffect(() => {
        if (countries.length <= 0 && countryData && countryData.getCountries) {
            const formattedCountries = countryData.getCountries.map((country: any) => ({
                value: country.countryId,
                label: country.name,
            }));
            setCountries(formattedCountries);
        }
    }, [countryData]);

    useEffect(() => {
        if (user && user.since) {
            const fecha = new Date(user.since);
            setSince(fecha.toLocaleDateString('en-US', opciones));
        } else {
            setSince(null);
        }
    }, [user]);

    const resetAlert = () => {
        setShowAlert(false)
        setMessage({message: "", type: ""})
    }

    // PROFILE UPDATE
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: errorsProfile },
        control
    } = useForm<ProfileFormValues>();

    const onSubmitProfile = handleSubmitProfile(async (data: any) => {
        resetAlert()
        await ProfileUpdate(data.firstName, data.lastName, data.professionalHeadline, data.city, data.countryId[0])
    });

    // PASSWORD
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: errorsPassword },
        getValues: getValuesPassword,
    } = useForm<PasswordFormValues>();

    const onSubmitPassword = handleSubmitPassword(async (data: any) => {
        resetAlert()
        await ChangePassword(data.currentPassword, data.newPassword)
    });

    useEffect(() => {
        if(countryError?.message){
            setShowAlert(true);
            setMessage({message: countryError?.message, type:"error"});
        }else if (passwordError?.message) {
            setShowAlert(true);
            setMessage({message: passwordError?.message, type:"error"});
        }else if(profileError?.message){
            setShowAlert(true);
            setMessage({message: profileError?.message, type:"error"});
        }
    }, [passwordError, countryError, profileError]);

    useEffect(() => {
        if(passwordData){
            const valor = Object.values(passwordData).find(value => value !== undefined);
            setMessage({message: valor, type: "success"})
            setShowAlert(true)
        }else if(profileData){
            const valor = Object.values(profileData).find(value => value !== undefined);
            setMessage({message: valor, type: "success"})
            setShowAlert(true)
        }
    }, [passwordData, profileData]);

    const items = [
        {
            index: "1",
            title: "Profile Information",
            icon: <ImProfile />,
            content: (
                <Stack pl={7}>
                    <Box w={"full"} mb={3}>
                        <Heading size="3xl">Profile Information</Heading>
                    </Box>
                    <Box w={"full"} mb={10}>
                        <Heading size="lg">Fill in your basic information</Heading>
                    </Box>
                    <form onSubmit={onSubmitProfile}>
                        <Stack gap={4}>
                            <Flex direction={"row"} gap={5}>
                                <Field.Root invalid={!!errorsProfile.firstName}>
                                    <Field.Label>First Name</Field.Label>
                                    <Input {...registerProfile("firstName", { required: "First Name is required" })} defaultValue={user?.firstName ?? undefined}/>
                                    <Field.ErrorText>{errorsProfile.firstName?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root invalid={!!errorsProfile.lastName}>
                                    <Field.Label>Last Name</Field.Label>
                                    <Input {...registerProfile("lastName", { required: "Last Name is required" })} defaultValue={user?.lastName ?? undefined}/>
                                    <Field.ErrorText>{errorsProfile.lastName?.message}</Field.ErrorText>
                                </Field.Root>
                            </Flex>

                            <Flex direction={"row"}>
                                <Field.Root invalid={!!errorsProfile.professionalHeadline}>
                                    <Field.Label>Professional Headline</Field.Label>
                                    <Input {...registerProfile("professionalHeadline", { required: "Professional Headline is required" })} defaultValue={user?.professionalHeadline ?? undefined}/>
                                    <Field.ErrorText>{errorsProfile.professionalHeadline?.message}</Field.ErrorText>
                                </Field.Root>
                            </Flex>

                            <Flex direction={"row"} gap={5}>
                                <Field.Root invalid={!!errorsProfile.countryId}>
                                    <Field.Label>Country</Field.Label>
                                    <Controller
                                        control={control}
                                        name="countryId"
                                        rules={{ required: "Country is required" }}
                                        render={({ field }) => (
                                            <SearchableSelect disabled={countryLoading} placeholder={"Select your Country"} options={countries} field={field} multiple={false} defaultValue={user?.countryId ?? null}/>
                                        )}
                                    />
                                    <Field.ErrorText>{errorsProfile.countryId?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root invalid={!!errorsProfile.city}>
                                    <Field.Label>City</Field.Label>
                                    <Input {...registerProfile("city", { required: "City is required" })} defaultValue={user?.city ?? undefined}/>
                                    <Field.ErrorText>{errorsProfile.city?.message}</Field.ErrorText>
                                </Field.Root>
                            </Flex>

                            <Button 
                                type="submit" 
                                alignSelf={"flex-end"} 
                                bg={"cyan.600"} 
                                color={"white"}
                                loading={profileLoading}
                                disabled={profileLoading}
                            >
                                <IoIosSave />Save
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            )
        },
        {
            index: "2",
            title: "Professional Information",
            icon: <FaUserTie />,
            content: ""
        },
        {
            index: "3",
            title: "Social Media",
            icon: <PiShareNetworkFill />,
            content: ""
        },
        {
            index: "4",
            title: "Password",
            icon: <RiLockPasswordFill />,
            content: (
                <Stack pl={7}>
                    <Box w={"full"} mb={3}>
                        <Heading size="3xl">Password</Heading>
                    </Box>
                    <Box w={"full"} mb={10}>
                        <Heading size="lg">Change your Password</Heading>
                    </Box>
                    <form onSubmit={onSubmitPassword}>
                        <Stack gap={4}>
                            <Field.Root invalid={!!errorsPassword.currentPassword}>
                                <Field.Label>Current Password</Field.Label>
                                <PasswordInput {...registerPassword("currentPassword", { required: "Password is required" })} />
                                <Field.ErrorText>{errorsPassword.currentPassword?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errorsPassword.newPassword}>
                                <Field.Label>New Password</Field.Label>
                                <PasswordInput 
                                    {...registerPassword("newPassword", { 
                                        required: "New Password is required",
                                        validate: value => value === getValuesPassword("confirmPassword") || "Passwords must match"
                                    })}
                                />
                                <Field.ErrorText>{errorsPassword.newPassword?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errorsPassword.confirmPassword}>
                                <Field.Label>Confirm Password</Field.Label>
                                <PasswordInput 
                                    {...registerPassword("confirmPassword", {
                                        required: "Confirm Password is required",
                                        validate: value => value === getValuesPassword("newPassword") || "Passwords must match"
                                    })}
                                />
                                <Field.ErrorText>{errorsPassword.confirmPassword?.message}</Field.ErrorText>
                            </Field.Root>

                            <Button 
                                type="submit" 
                                alignSelf={"flex-end"} 
                                bg={"cyan.600"} 
                                color={"white"}
                                loading={passwordLoading}
                                disabled={passwordLoading}
                            >
                                <IoIosSave />Save
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            )
        }
    ];

    const handleTab = (e) => {
        setActiveTab(e.value);
    };

    return (
        <Box
            mx={5}
            bg={colorMode === "light" ? "whiteAlpha.950" : "blackAlpha.500"}
            shadow={"lg"}
            rounded={"lg"}
            maxH={"50vh"}
        >
            <Grid w={"75%"} templateColumns="35% 65%" gap={4} p={10} justifySelf={"center"} alignSelf={"center"}>
                <GridItem display="flex" justifyContent="center" alignItems="center">
                    <Stack>
                        <Box 
                            w="100%"
                            display={"flex"}
                            justifyContent="center" 
                            alignItems="center"
                        >
                            {user?.avatar ? (
                                <Image
                                    src="URL_DE_TU_IMAGEN"
                                    alt="Imagen centrada"
                                    boxSize="200px"
                                    borderRadius="full"
                                    fit="cover"
                                />
                            ):(
                                <Icon as={ImUser} boxSize="200px" color={colorMode === "light" ? "cyan.50":"pink.200"} bg={colorMode === "light" ? "cyan.500":"pink.500"} rounded={"full"}/>
                            )}
                        </Box>
                        <Box 
                            w="100%"
                            my={5}
                        >
                            <Text fontSize={"2xl"} justifySelf={"center"} textAlign={"center"} fontWeight={"extrabold"}>{user?.firstName} {user?.lastName}</Text>
                            <Text fontSize={"xl"} justifySelf={"center"} textAlign={"center"}>{user?.username}</Text>
                        </Box>
                        <Box 
                            w="100%"
                        >
                            <Text fontSize={"lg"} justifySelf={"center"} textAlign={"center"}>Member since {since}</Text>
                        </Box>
                    </Stack>
                </GridItem>
                <GridItem>
                    <Tabs.Root
                        lazyMount
                        unmountOnExit
                        defaultValue="1"
                        orientation="vertical"
                        onValueChange={handleTab}
                        value={activeTab}
                        w={"full"}
                    >
                        <Tabs.List p={1} gap={3} overflowX="hidden" w={"13vw"}>
                            {items.map((item) => (
                                <Tabs.Trigger
                                    key={item.index}
                                    value={item.index}
                                    _selected={{
                                        borderLeft: "4px solid",
                                        borderLeftColor:
                                            colorMode === "light" ? "cyan.500" : "pink.500",
                                        backgroundColor:
                                            colorMode === "light" ? "cyan.50" : "pink.200",
                                        color: "black",
                                    }}
                                    rounded={"sm"}
                                    bg={"none"}
                                >
                                    <Box
                                        position={"relative"}
                                        overflow={"hidden"}
                                        whiteSpace={"nowrap"}
                                        display={"flex"}
                                        direction={"row"}
                                        justifyContent={"flex-start"}
                                        alignItems={"center"}
                                        gap={2}
                                        w={"full"}
                                    >
                                        <Icon
                                            size={"md"}
                                            color={colorMode === "light" ? "cyan.500" : "pink.500"}
                                        >
                                            {item.icon}
                                        </Icon>
                                        <Text gap={2} truncate>
                                            {item.title}
                                        </Text>
                                    </Box>
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>
                        <Box position={"relative"} w={"full"} h="calc(50vh - 100px)">
                            {items.map((item) => (
                                <Box
                                    key={item.index}
                                    position="absolute"
                                    inset="0"
                                    display={activeTab === item.index ? 'block' : 'none'}
                                    overflowY="auto"
                                    maxH="100%"
                                >
                                    <Tabs.Content
                                        key={item.index}
                                        value={item.index}
                                        position="absolute"
                                        inset="0"
                                        _open={{
                                            animationName: "fade-in, scale-in",
                                            animationDuration: "300ms",
                                        }}
                                        _closed={{
                                            animationName: "fade-out, scale-out",
                                            animationDuration: "120ms",
                                        }}
                                    >
                                        {item.content}
                                    </Tabs.Content>
                                </Box>
                            ))}
                        </Box>
                    </Tabs.Root>
                </GridItem>
            </Grid>
            {showAlert && message.message != "" &&(
                <NotificationAlert
                    type={message.type}
                    title="User Settings"
                    message={message.message}
                    onClose={() => {
                        setMessage({message: "", type: ""})
                        setShowAlert(false);
                    }}
                />
            )}
        </Box>
    );
};

export default ProfileSettings;