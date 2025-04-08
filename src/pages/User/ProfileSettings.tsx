import { useColorMode } from "@/components/ui/color-mode";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/context/AuthContext";
import { Box, Icon, Tabs, Text, Grid, GridItem, Image, Stack, Field, Button, Heading, Flex, Input, For } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaUserTie } from "react-icons/fa";
import { ImProfile, ImUser } from "react-icons/im";
import { useChangePassword, useProfileUpdate } from "../../services/User/UserService";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoIosSave } from "react-icons/io";
import { PiShareNetworkFill } from "react-icons/pi";
import NotificationAlert from "@/custom/Components/NotificationAlert";
import SearchableSelect from "@/custom/Components/SearchableSelect";
import { useGetCountry } from "@/services/Country/CountryService";
import { useGetSocialMedia } from "@/services/SocialMedia/SocialMediaService";
import { useGetUserSocialMedia, useStoreUserSocialNetowrk } from "@/services/UserSocialNetwork/UserSocialNetworkService";
import LoadingProgress from "@/custom/Components/LoadingProgress";
import SocialMediaListItem from "@/custom/Components/SocialMediaListItem";

interface ProfileFormValues {
    firstName: string;
    lastName: string;
    professionalHeadline: string;
    countryId: number;
    city: string;
}

interface SocialMediaFormValues {
    socialMediaId: number;
    link: string;
}

interface PasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ProfileSettings = () => {
    const [countries, setCountries] = useState([]);
    const [socialMedia, setSocialMedia] = useState([]);
    const [userSocialMedia, setUserSocialMedia] = useState([]);

    const { getCountries, data: countryData, error: countryError, loading: countryLoading } = useGetCountry();
    const { getSocialMedia, data: socialMediaData, error: socialMediaError, loading: socialMediaLoading } = useGetSocialMedia();
    const { getUserSocialMedia, data: userSocialMediaData, error: userSocialMediaError, loading: userSocialMediaLoading } = useGetUserSocialMedia();
    
    const { changePassword: ChangePassword, data: passwordData, error: passwordError, loading: passwordLoading } = useChangePassword();
    const { profileUpdate: ProfileUpdate, data: profileData, error: profileError, loading: profileLoading } = useProfileUpdate();
    const { storeUserNetwork: StoreUserNetwork, data: storeUserNetworkData, error: storeUserNetworkError, loading: storeUserNetworkLoading } = useStoreUserSocialNetowrk();

    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState({message: "", type: ""});
    
    const [activeTab, setActiveTab] = useState<string | null>("1");
    const [since, setSince] = useState<string | null>(null);
    const { colorMode } = useColorMode();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const buttonRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState('auto');
    
    const opciones = {
        year: 'numeric',
        month: 'long',
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const updateWidth = () => {
            if (buttonRef.current) {
                setButtonWidth(`${buttonRef.current.offsetWidth}px`);
            } else {
                setTimeout(updateWidth, 50);
            }
        };

        updateWidth();
    }, []);

    useEffect(() => {
        if(activeTab == "1"){
            getCountries()
        }
        if (activeTab == "3") {
            getSocialMedia()
            getUserSocialMedia()
        }
    }, [activeTab]);

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
        if (socialMedia.length <= 0 && socialMediaData && socialMediaData.getSocialMedia) {
            const formattedSocialMedia = socialMediaData.getSocialMedia.map((network: any) => ({
                value: network.socialMediaId,
                label: network.name,
            }));
            setSocialMedia(formattedSocialMedia);
        }

        if(userSocialMediaData && userSocialMediaData.getUserSocialMedia){
            setUserSocialMedia(userSocialMediaData.getUserSocialMedia)
        }
    }, [socialMediaData, userSocialMediaData]);

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
        control: profileControl
    } = useForm<ProfileFormValues>();

    const onSubmitProfile = handleSubmitProfile(async (data: any) => {
        resetAlert()
        await ProfileUpdate(data.firstName, data.lastName, data.professionalHeadline, data.city, data.countryId[0])
    });

    // SOCIAL MEDIA
    const {
        register: registerSocialMedia,
        handleSubmit: handleSocialMedia,
        formState: { errors: errorsSocialeMedia },
        control: socialMediaControl
    } = useForm<SocialMediaFormValues>();

    const onSubmitSocialMedia = handleSocialMedia(async (data: any) => {
        resetAlert()
        await StoreUserNetwork(data.socialMediaId[0], data.link)
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
        if(profileError?.message){
            setShowAlert(true);
            setMessage({message: profileError?.message, type:"error"});
        }else if (countryError?.message) {
            setShowAlert(true);
            setMessage({message: countryError?.message, type:"error"});
        }else if(socialMediaError?.message){
            setShowAlert(true);
            setMessage({message: socialMediaError?.message, type:"error"});
        }else if(userSocialMediaError?.message){
            setShowAlert(true);
            setMessage({message: userSocialMediaError?.message, type:"error"});
        }else if(storeUserNetworkError?.message){
            setShowAlert(true);
            setMessage({message: storeUserNetworkError?.message, type:"error"});
        }else if (passwordError?.message) {
            setShowAlert(true);
            setMessage({message: passwordError?.message, type:"error"});
        }
    }, [profileError, countryError, socialMediaError, userSocialMediaError, storeUserNetworkError, passwordError ]);

    useEffect(() => {
        if(profileData){
            const valor = Object.values(profileData).find(value => value !== undefined);
            setMessage({message: valor, type: "success"})
            setShowAlert(true)
        }else if(storeUserNetworkData){
            const valor = Object.values(storeUserNetworkData).find(value => value !== undefined);
            setMessage({message: valor, type: "success"})
            setShowAlert(true)
        }else if(passwordData){
            const valor = Object.values(passwordData).find(value => value !== undefined);
            setMessage({message: valor, type: "success"})
            setShowAlert(true)
        } 
    }, [profileData, storeUserNetworkData, passwordData]);

    const items = [
        {
            index: "1",
            title: "Profile Information",
            icon: <ImProfile />,
            content: (countryData ? (
                <Stack p={7}>
                    <Box w={"full"}>
                        <Box w={"full"} mb={3}>
                            <Heading size="3xl">Profile Information</Heading>
                        </Box>
                        <Box w={"full"} mb={10}>
                            <Heading size="lg">Fill in your basic information</Heading>
                        </Box>
                    </Box>
                    <form onSubmit={onSubmitProfile}>
                        <Stack gap={5}>
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
                                        control={profileControl}
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
            ):(
                <LoadingProgress/>
            ))
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
            content: (socialMediaData && userSocialMediaData ? (
                <Stack p={7}>
                    <Box w={"full"}>
                        <Box w={"full"} mb={3}>
                            <Heading size="3xl">Social Media</Heading>
                        </Box>
                        <Box w={"full"} mb={10}>
                            <Heading size="lg">Share your Contact & Social Media links</Heading>
                        </Box>
                    </Box>
                    <form onSubmit={onSubmitSocialMedia}>
                        <Stack gap={5}>
                            <Flex direction={"row"} gap={5} w={"full"} alignItems={"center"}>
                                <Field.Root invalid={!!errorsSocialeMedia.socialMediaId} w={"15vw"}>
                                    <Field.Label>Social Network</Field.Label>
                                    <Controller
                                        control={socialMediaControl}
                                        name="socialMediaId"
                                        rules={{ required: "Social Network is required" }}
                                        render={({ field }) => (
                                            <SearchableSelect disabled={socialMediaLoading} placeholder={"Select Social Netowrk"} options={socialMedia} field={field} multiple={false} defaultValue={null}/>
                                        )}
                                    />
                                    <Field.ErrorText>{errorsSocialeMedia.socialMediaId?.message}</Field.ErrorText>
                                </Field.Root>
                                <Field.Root invalid={!!errorsSocialeMedia.link}>
                                    <Field.Label>Link</Field.Label>
                                    <Input {...registerSocialMedia("link", { required: "Link is required" })}/>
                                    <Field.ErrorText>{errorsSocialeMedia.link?.message}</Field.ErrorText>
                                </Field.Root>
                            </Flex>
                            
                            <Button
                                type="submit" 
                                alignSelf={"flex-end"} 
                                bg={"cyan.600"} 
                                color={"white"}
                                loading={storeUserNetworkLoading}
                                disabled={storeUserNetworkLoading}
                            >
                                <IoIosSave />Save
                            </Button>

                            <Box w={"full"} display={userSocialMediaLoading || storeUserNetworkLoading ? "flex":"inline"} justifyContent={userSocialMediaLoading || storeUserNetworkLoading  ? "center":"start"}>
                                {userSocialMediaLoading || storeUserNetworkLoading ? (
                                    <LoadingProgress />
                                ):userSocialMedia.length > 0 && (
                                    <Stack gap={5}>
                                        <Text fontSize={"2xl"} fontWeight="bold" my={5}>Added Social Media</Text>
                                        <For
                                            each={userSocialMedia}
                                        >
                                            {(item) => {
                                                return (
                                                    <SocialMediaListItem 
                                                        key={item.userSocialNetworkId}
                                                        item={item} 
                                                        socialMedia={socialMedia}
                                                        socialMediaLoading={socialMediaLoading}
                                                    />
                                                )

                                                /*const [menuOpen, setMenuOpen] = useState(false);
                                                const [popoverOpen, setPopoverOpen] = useState(false);
                                                const [editingId, setEditingId] = useState(null);

                                                const {
                                                    register: editSocialMedia,
                                                    handleSubmit: handleUpdateSocialMedia,
                                                    formState: { errors: errorsUpdateSocialeMedia },
                                                    control: updateSocialMediaControl
                                                } = useForm<SocialMediaFormValues>();

                                                const handleEditClick = (item) => {
                                                    setEditingId(item.userSocialNetworkId);
                                                };
                                            
                                                const updateSocialNetwork = (updatedItem: any) => {
                                                    setUserSocialMedia((prevUserSocialMedia) => {
                                                        return prevUserSocialMedia.map((item) => {
                                                            if (item.userSocialNetworkId === editingId) {
                                                                return {
                                                                    ...item,
                                                                    network: updatedItem.network,
                                                                    socialMediaId: updatedItem.socialMediaId, 
                                                                    link: updatedItem.link,
                                                                };
                                                            }
                                                            return item;
                                                        });
                                                    });
                                                };

                                                const handleClose = () => {
                                                    setMenuOpen(false)
                                                    setEditingId(null);
                                                }

                                                const onSubmitUpdateSocialMedia = handleUpdateSocialMedia(async (data: any) => {
                                                    setExecutingId([...executingId, editingId])
                                                    await UpdateUserNetwork(editingId, data.socialMediaId[0], data.link)
                                                    const itemToUpdate = socialMedia.find(item => item.value === data.socialMediaId[0]);
                                                    updateSocialNetwork({
                                                        socialMediaId: data.socialMediaId[0],
                                                        link: data.link,
                                                        network: itemToUpdate ? itemToUpdate.label:""
                                                    });
                                                    setExecutingId(executingId.filter((item) => item !== editingId))
                                                    handleClose()
                                                })

                                                return (
                                                    <React.Fragment key={item.userSocialNetworkId}>
                                                        <Separator size="sm" />
                                                        <Flex direction={"row"} key={item.userSocialNetworkId} justifyContent={"space-between"} alignItems={"center"} px={5} w={"full"}>
                                                            <Grid w="full" templateColumns={editingId ? "30% 60% 10%":"10% 80% 10%"} gap={4}>
                                                                {editingId === item.userSocialNetworkId ? (
                                                                    <>
                                                                        {executingId.includes(item.userSocialNetworkId) && updateUserNetworkLoading ? (
                                                                            <LoadingProgress />
                                                                        ):(
                                                                            <>
                                                                                <GridItem alignItems={"center"} display={"flex"} justifyContent={"flex-start"}>
                                                                                    <Field.Root invalid={!!errorsUpdateSocialeMedia.socialMediaId} w={"15vw"}>
                                                                                        <Controller
                                                                                            control={updateSocialMediaControl}
                                                                                            name="socialMediaId"
                                                                                            rules={{ required: "Social Network is required" }}
                                                                                            render={({ field }) => (
                                                                                                <SearchableSelect disabled={socialMediaLoading} placeholder={"Select Social Netowrk"} options={socialMedia} field={field} multiple={false} defaultValue={item.socialMediaId}/>
                                                                                            )}
                                                                                        />
                                                                                        <Field.ErrorText>{errorsUpdateSocialeMedia.socialMediaId?.message}</Field.ErrorText>
                                                                                    </Field.Root>
                                                                                </GridItem>
                                                                                <GridItem alignItems={"center"} display={"flex"} justifyContent={"flex-start"}>
                                                                                    <Field.Root invalid={!!errorsUpdateSocialeMedia.link}>
                                                                                        <Input {...editSocialMedia("link", { required: "Link is required" })} defaultValue={item.link}/>
                                                                                        <Field.ErrorText>{errorsUpdateSocialeMedia.link?.message}</Field.ErrorText>
                                                                                    </Field.Root>
                                                                                </GridItem>
                                                                                <GridItem alignItems={"center"} display={"flex"} justifyContent={"center"}>
                                                                                    <Button
                                                                                        type="submit" 
                                                                                        alignSelf={"flex-end"} 
                                                                                        bg={"cyan.600"} 
                                                                                        color={"white"}
                                                                                        loading={false}
                                                                                        disabled={false}
                                                                                        onClick={onSubmitUpdateSocialMedia}
                                                                                    >
                                                                                        <IoIosSave />
                                                                                    </Button>
                                                                                </GridItem>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                ):(
                                                                    <>
                                                                        <GridItem alignItems={"center"} display={"flex"} justifyContent={"flex-start"}>
                                                                            <IconsSocialMedia key={item.userSocialNetworkId} socialNetwork={item.network} link={item.link} size={'lg'} />
                                                                        </GridItem>
                                                                        <GridItem alignItems={"center"} display={"flex"} justifyContent={"flex-start"}>
                                                                            <Text color="fg.muted">{item.link}</Text>
                                                                        </GridItem>
                                                                        <GridItem alignItems={"center"} display={"flex"} justifyContent={"center"}>
                                                                            <Menu.Root unmountOnExit lazyMount open={menuOpen}>
                                                                                <Menu.Trigger asChild onClick={() => setMenuOpen(!menuOpen)}>
                                                                                    <Button size={"md"} bg={"transparent"} color={colorMode === "light" ? "cyan.500":"pink.500"} ref={buttonRef}>
                                                                                        <Icon size={"lg"}>
                                                                                            <GrMenu />
                                                                                        </Icon>
                                                                                    </Button>
                                                                                </Menu.Trigger>
                                                                                <Portal>
                                                                                    <Menu.Positioner>
                                                                                        <Menu.Content minW={buttonWidth} style={{ minWidth: buttonWidth }}>
                                                                                            <Tooltip
                                                                                                content="Edit"
                                                                                                openDelay={500}
                                                                                                closeDelay={100}
                                                                                                unmountOnExit={true}    
                                                                                                lazyMount={true}
                                                                                                positioning={{ placement: "top" }}
                                                                                                showArrow
                                                                                                contentProps={{ 
                                                                                                    css: { 
                                                                                                        "--tooltip-bg": colorMode === "light" ? "colors.cyan.500" : "colors.pink.500",
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <Menu.Item value={"edit"} justifyContent={"center"} alignItems={"center"} onClick={() => handleEditClick(item)}>
                                                                                                    <Icon size={"sm"} color={colorMode === "light" ? "cyan.500":"pink.500"}>
                                                                                                        <AiFillEdit />
                                                                                                    </Icon>
                                                                                                </Menu.Item>
                                                                                            </Tooltip>
                                                                                            <Separator my={1}/>
                                                                                            <Tooltip
                                                                                                content="Remove"
                                                                                                openDelay={500}
                                                                                                closeDelay={100}
                                                                                                unmountOnExit={true}    
                                                                                                lazyMount={true}
                                                                                                positioning={{ placement: "top" }}
                                                                                                showArrow
                                                                                                contentProps={{ 
                                                                                                    css: { 
                                                                                                        "--tooltip-bg": "tomato",
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <Menu.Item
                                                                                                    value={"delete"}
                                                                                                    color="fg.error"
                                                                                                    _hover={{ bg: "bg.error", color: "fg.error" }}
                                                                                                    justifyContent={"center"} 
                                                                                                    alignItems={"center"}
                                                                                                >
                                                                                                    <Popover.Root lazyMount unmountOnExit open={popoverOpen}>
                                                                                                        <Popover.Trigger asChild onClick={() => setPopoverOpen(!popoverOpen)}>
                                                                                                            <Icon size={"sm"}>
                                                                                                                <TiDelete />
                                                                                                            </Icon>
                                                                                                        </Popover.Trigger>
                                                                                                        <Portal>
                                                                                                            <Popover.Positioner>
                                                                                                                <Popover.Content>
                                                                                                                    <Popover.Arrow />
                                                                                                                    <Popover.Header fontWeight="bold" color={colorMode === "light" ? "black":"white"}>Remove</Popover.Header>
                                                                                                                    <Popover.Body>
                                                                                                                        <Text color={colorMode === "light" ? "black":"white"}>
                                                                                                                            Are you sure you want to remove this Social Netowrk?
                                                                                                                        </Text>
                                                                                                                    </Popover.Body>
                                                                                                                    <Popover.Footer justifyContent={"flex-end"}>
                                                                                                                        <Group display={"flex"}>
                                                                                                                            <Button 
                                                                                                                                size="xs" 
                                                                                                                                onClick={() => {
                                                                                                                                    removeSocialNetowrk(item)
                                                                                                                                    setPopoverOpen(false)
                                                                                                                                    setMenuOpen(false)
                                                                                                                                }} 
                                                                                                                                bg={"tomato"} 
                                                                                                                                color={"white"}
                                                                                                                            >Yes</Button>
                                                                                                                            <Button size="xs" onClick={() => setPopoverOpen(false)} variant={"surface"} bg={"transparent"} color={colorMode === "light" ? "black":"white"}>No</Button>
                                                                                                                        </Group>
                                                                                                                    </Popover.Footer>
                                                                                                                </Popover.Content>
                                                                                                            </Popover.Positioner>
                                                                                                        </Portal>
                                                                                                    </Popover.Root>
                                                                                                    
                                                                                                </Menu.Item>
                                                                                            </Tooltip>
                                                                                        </Menu.Content>
                                                                                    </Menu.Positioner>
                                                                                </Portal>
                                                                            </Menu.Root>
                                                                        </GridItem>
                                                                    </>
                                                                )}
                                                            </Grid>
                                                        </Flex>
                                                    </React.Fragment>
                                                )*/
                                            }}
                                        </For>
                                    </Stack>
                                )}
                            </Box>
                        </Stack>
                    </form>
                </Stack>
            ):(
                <LoadingProgress/>
            ))
        },
        {
            index: "4",
            title: "Password",
            icon: <RiLockPasswordFill />,
            content: (
                <Stack pl={7}>
                    <Box w={"full"}>
                        <Box w={"full"} mb={3}>
                            <Heading size="3xl">Password</Heading>
                        </Box>
                        <Box w={"full"} mb={10}>
                            <Heading size="lg">Change your Password</Heading>
                        </Box>
                    </Box>
                    <form onSubmit={onSubmitPassword}>
                        <Stack gap={5}>
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
        resetAlert()
    };

    return (
        <Box
            mx={5}
            bg={colorMode === "light" ? "whiteAlpha.950" : "blackAlpha.500"}
            shadow={"lg"}
            rounded={"lg"}
            maxH={"89vh"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Grid w={"75%"} templateColumns="35% 65%" gap={4} p={10}>
                <GridItem display="flex" justifyContent="center" alignItems="center">
                    <Stack>
                        <Box 
                            w="100%"
                            display={"flex"}
                            justifyContent="center" 
                            alignItems="center"
                            onClick={handleImageClick}
                        >
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt="Selected Image"
                                    boxSize="200px"
                                    borderRadius="full"
                                    fit="cover"
                                    cursor="pointer"
                                />
                            ) : user?.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt="Stored Image"
                                    boxSize="200px"
                                    borderRadius="full"
                                    fit="cover"
                                    cursor="pointer"
                                />
                            ) : (
                                <Icon
                                    as={ImUser}
                                    boxSize="200px"
                                    color={colorMode === 'light' ? 'cyan.50' : 'pink.200'}
                                    bg={colorMode === 'light' ? 'cyan.500' : 'pink.500'}
                                    rounded={'full'}
                                    cursor="pointer"
                                />
                            )}
                        </Box>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
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
                        <Box position={"relative"} w={"full"} h="calc(89vh - 100px)">
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
                    title="Profile Settings"
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