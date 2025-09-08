import { useColorMode } from "@/components/ui/color-mode";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/context/AuthContext";
import { Box, Icon, Tabs, Text, Grid, GridItem, Image, Stack, Field, Button, Heading, Flex, Input, For, Show, Card, IconButton, CheckboxCard, Textarea } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ImProfile, ImUser } from "react-icons/im";
import { useChangePassword, useProfileUpdate, useStoreUserPicture } from "../../services/User/UserService";
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
import { GrNodes } from "react-icons/gr";
import SearchableInput from "@/custom/Components/SearchableInput";
import { useGetSkillsData, useGetUserSkills, useStoreUserSkills } from "@/services/UserSkills/UserSkillService";

interface ProfileFormValues {
    firstName: string;
    lastName: string;
    professionalHeadline: string;
    summary: string;
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

interface CategoryOption {
    value: number;
    label: string;
}

interface SoftwareOptions {
    value: number;
    label: string;
}

interface TopicOptions {
    value: number;
    label: string;
}

interface ItemSocialMedia {
    userSocialNetworkId: number; 
    socialMediaId: number;
    network: string;
    link: string;
}

interface Country {
    countryId: number;
    name: string;
}

interface MessageInterface {
    type: "error" | "success" | "warning" | "info" | undefined,
    message: string
}

const backendUrl = import.meta.env.VITE_API_URL;

const ProfileSettings = () => {
    const { user, updateUser } = useAuth();

    const [countries, setCountries] = useState([]);
    const [socialMedia, setSocialMedia] = useState([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [topics, setTopics] = useState<TopicOptions[]>([]);
    const [softwares, setSoftwares] = useState<SoftwareOptions[]>([]);    const [userSocialMedia, setUserSocialMedia] = useState([]);

    const { getCountries, data: countryData, error: countryError, loading: countryLoading } = useGetCountry();
    const { getSocialMedia, data: socialMediaData, error: socialMediaError, loading: socialMediaLoading } = useGetSocialMedia();
    const { getUserSocialMedia, data: userSocialMediaData, error: userSocialMediaError, loading: userSocialMediaLoading } = useGetUserSocialMedia();
    const { getSkillsData, data: skillsData, error: skillsError, loading: skillsLoading } = useGetSkillsData();
    const { getUserSkills, data: userSkillsData, error: userSkillsError, loading: userSkillsLoading } = useGetUserSkills();
    
    const { storeUserPicture, data: storeUserPictureData, error: storeUserPictureError, loading: storeUserPictureLoading } = useStoreUserPicture();
    const { profileUpdate: ProfileUpdate, data: profileData, error: profileError, loading: profileLoading } = useProfileUpdate();
    const { storeUserSkills: StoreUserSkills, data: storeUserSkillsData, error: storeUserSkillsError, loading: storeUserSkillsLoading } = useStoreUserSkills();
    const { storeUserNetwork: StoreUserNetwork, data: storeUserNetworkData, error: storeUserNetworkError, loading: storeUserNetworkLoading } = useStoreUserSocialNetowrk();
    const { changePassword: ChangePassword, data: passwordData, error: passwordError, loading: passwordLoading } = useChangePassword();

    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState<MessageInterface>({message: "", type: undefined});
    
    const [activeTab, setActiveTab] = useState<string | null>("1");
    const [since, setSince] = useState<string | null>(null);
    const { colorMode } = useColorMode();
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const buttonRef = useRef<HTMLButtonElement>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<TopicOptions[]>([]);
    const [selectedSoftware, setSelectedSoftware] = useState<SoftwareOptions[]>([]);
    // const [buttonWidth, setButtonWidth] = useState('auto');

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        resetAlert()
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const picture = reader.result?.toString() || '';
                await storeUserPicture(picture)
            };
            reader.readAsDataURL(file);
        }
    };

    // useEffect(() => {
    //     const updateWidth = () => {
    //         if (buttonRef.current) {
    //             setButtonWidth(`${buttonRef.current.offsetWidth}px`);
    //         } else {
    //             setTimeout(updateWidth, 50);
    //         }
    //     };

    //     updateWidth();
    // }, []);

    useEffect(() => {
        if(activeTab == "1"){
            getCountries();
        }

        if (activeTab == "2") {
            getSkillsData();
            getUserSkills();
        }

        if (activeTab == "3") {
            getSocialMedia();
            getUserSocialMedia();
        }
    }, [activeTab]);

    useEffect(() => {
        if (countryData?.getCountries) {
            const formattedCountries = countryData.getCountries.map((country: Country) => ({
                value: country.countryId,
                label: country.name,
            }));
            setCountries(formattedCountries);
        }
    }, [countryData]);

    useEffect(() => {
        if (skillsData?.getSkillsData) {
            const { categories, softwares, topics } = skillsData.getSkillsData;

            const formattedTopics = topics.map((topic: any) => ({
                value: topic.topicId,
                label: topic.name
            }));
            setTopics(formattedTopics);

            const formattedCategories = categories.map((category: any) => ({
                value: category.categoryId,
                label: category.name
            }));
            setCategories(formattedCategories);

            const formattedSoftwares = softwares.map((software: any) => ({
                value: software.softwareId,
                label: software.name
            }));
            setSoftwares(formattedSoftwares);
        }

        if(userSkillsData?.getUserSkills){
            const { userCategories, userSoftwares, userTopics } = userSkillsData.getUserSkills;
            
            if(userCategories && userCategories.length > 0){
                setSelectedCategories(userCategories.map((item: any) => {
                    return item.categoryId
                }))
            }

            if(userSoftwares && userSoftwares.length > 0){
                setSelectedSoftware(userSoftwares.map((item: any) => {
                    return {
                        value: item.softwareId,
                        label: item.software
                    }
                }))
            }

            if(userTopics && userTopics.length > 0){
                setSelectedTopic(userTopics.map((item: any) => {
                    return {
                        value: item.topicId,
                        label: item.topic
                    }
                }))
            }
        }
    }, [skillsData, userSkillsData]);

    useEffect(() => {
        if (socialMediaData?.getSocialMedia) {
            const formattedSocialMedia = socialMediaData.getSocialMedia.map((network: any) => ({
                value: network.socialMediaId,
                label: network.name,
            }));
            setSocialMedia(formattedSocialMedia);
        }

        if(userSocialMediaData?.getUserSocialMedia){
            setUserSocialMedia(userSocialMediaData.getUserSocialMedia)
        }
    }, [socialMediaData, userSocialMediaData]);

    useEffect(() => {
        if (user?.since) {
            const fecha = new Date(user.since);
            setSince(fecha.toLocaleDateString('en-US', options));
        } else {
            setSince(null);
        }
    }, [user]);

    const resetAlert = () => {
        setShowAlert(false)
        setMessage({message: "", type: undefined})
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
        await ProfileUpdate(data.firstName, data.lastName, data.professionalHeadline, data.summary, data.city, data.countryId[0])
    });

    // SKILLS && INTERESTS
    const handleCategoryChange = (categoryId: number) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const handleTopicChange = (item: TopicOptions, action: string) => {
        if(action === "remove"){
            if (selectedTopic.find((topic) => item.value === topic.value)) {
                setSelectedTopic(selectedTopic.filter((topic) => item.value !== topic.value));
            }
        }

        if(action === "add"){
            if (!selectedTopic.find((topic) => item.value == topic.value)) {
                setSelectedTopic([...selectedTopic, item]);
            }
        }
    };

    const handleSoftwareChange = (item: SoftwareOptions, action: string) => {
        if(action === "remove"){
            if (selectedSoftware.find((software) => item.value === software.value)) {
                setSelectedSoftware(selectedSoftware.filter((software) => item.value !== software.value));
            }
        }

        if(action === "add"){
            if (!selectedSoftware.find((software) => item.value == software.value)) {
                setSelectedSoftware([...selectedSoftware, item]);
            }
        }
    };

    const onSubmitSkills = (async () => {
        resetAlert()
        
        const data = {
            categories: selectedCategories,
            topics: selectedTopic.map(topic => topic.value),
            softwares: selectedSoftware.map(software => software.value)
        }
        
        await StoreUserSkills(data);
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
        if(storeUserPictureError?.message){
            setShowAlert(true);
            setMessage({message: storeUserPictureError?.message, type:"error"});
        }else if(profileError?.message){
            setShowAlert(true);
            setMessage({message: profileError?.message, type:"error"});
        }else if (countryError?.message) {
            setShowAlert(true);
            setMessage({message: countryError?.message, type:"error"});
        }else if (skillsError?.message) {
            setShowAlert(true);
            setMessage({message: skillsError?.message, type:"error"});
        }else if (userSkillsError?.message) {
            setShowAlert(true);
            setMessage({message: userSkillsError?.message, type:"error"});
        }else if (storeUserSkillsError?.message) {
            setShowAlert(true);
            setMessage({message: storeUserSkillsError?.message, type:"error"});
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
    }, [storeUserPictureError, profileError, countryError, skillsError, userSkillsError, storeUserSkillsError, socialMediaError, userSocialMediaError, storeUserNetworkError, passwordError ]);

    const displayMessage = (data: any) => {
        if (data) {
            const valor = Object.values(data).find(value => value !== undefined);
            if (valor && typeof valor === 'string' && valor.trim() != '') {
                setMessage({ message: valor, type: "success" });
                setShowAlert(true);
            }
        }
    };

    useEffect(() => {
        if (storeUserPictureData) {
            if (user && user.userId !== undefined) {
                const updatedUser = {
                    ...user,
                    avatar: storeUserPictureData.storeUserPicture.value,
                };
                updateUser(updatedUser);
                
                const valor = storeUserPictureData.storeUserPicture.label;
                setMessage({ message: valor, type: "success" });
                setShowAlert(true);
            }
        } else {
            displayMessage(profileData || storeUserSkillsData || storeUserNetworkData || passwordData);
        }
    }, [storeUserPictureData, profileData, storeUserSkillsData, storeUserNetworkData, passwordData]);

    
    const handleTab = (e: {value: string}) => {
        setActiveTab(e.value);
        resetAlert()
    };

    const items = [
        {
            index: "1",
            title: "Profile Information",
            icon: <ImProfile />,
            content: (
                <Show
                    when={!countryLoading}
                    fallback={
                        <LoadingProgress />
                    }
                >
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

                                <Flex direction={"row"}>
                                    <Field.Root invalid={!!errorsProfile.summary}>
                                        <Field.Label>Summary</Field.Label>
                                        <Textarea {...registerProfile("summary")} defaultValue={user?.summary ?? undefined} h={"3lh"}/>
                                        <Field.ErrorText>{errorsProfile.summary?.message}</Field.ErrorText>
                                    </Field.Root>
                                </Flex>

                                <Show
                                    when={countryData}
                                >
                                    <Flex direction={"row"} gap={5}>
                                        <Field.Root invalid={!!errorsProfile.countryId}>
                                            <Field.Label>Country</Field.Label>
                                            <Controller
                                                control={profileControl}
                                                name="countryId"
                                                // rules={{ required: "Country is required" }}
                                                render={({ field }) => (
                                                    <SearchableSelect disabled={countryLoading} placeholder={"Select your Country"} options={countries} field={field} multiple={false} defaultValue={user?.countryId ?? undefined}/>
                                                )}
                                            />
                                            <Field.ErrorText>{errorsProfile.countryId?.message}</Field.ErrorText>
                                        </Field.Root>
                                        <Field.Root invalid={!!errorsProfile.city}>
                                            <Field.Label>City</Field.Label>
                                            <Input {...registerProfile("city"/*, { required: "City is required" }*/)} defaultValue={user?.city ?? undefined}/>
                                            <Field.ErrorText>{errorsProfile.city?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Flex>
                                </Show>

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
                </Show>
            )
        },
        {
            index: "2",
            title: "Skills & Interests",
            icon: <GrNodes />,
            content: (
                <Show
                    when={!skillsLoading && !userSkillsLoading}
                    fallback={
                        <LoadingProgress/>
                    }
                >
                    <Stack p={7}>
                        <Box w={"full"}>
                            <Box w={"full"} mb={3}>
                                <Heading size="3xl">Skills & Interests</Heading>
                            </Box>
                            <Box w={"full"} mb={10}>
                                <Heading size="lg">Share your skills & interests</Heading>
                            </Box>
                        </Box>
                        <Show 
                            when={categories.length > 0 && topics.length > 0 && softwares.length > 0}
                            fallback={
                                <label>
                                    Ooops...Please try it later!
                                </label>
                            }
                        >
                            {/* <form> */}
                                <Stack gap={5}>
                                    <Box w={"full"} marginBottom={"25px"}>
                                        <Field.Root>
                                            <Field.Label fontSize={"lg"}>Main Categories</Field.Label>
                                        </Field.Root>
                                        <Flex
                                            gap={4}
                                            display="grid"
                                            gridTemplateColumns="repeat(4, 1fr)"
                                            gridAutoRows="auto"
                                            mt={3}
                                        >
                                            <For each={categories}>
                                                {(item) => (
                                                    <CheckboxCard.Root
                                                        key={item.value}
                                                        variant={"outline"}
                                                        colorPalette={colorMode === "light" ? "cyan" : "pink"}
                                                        onCheckedChange={() => handleCategoryChange(item.value)}
                                                        checked={selectedCategories.includes(item.value)}
                                                        cursor="pointer"
                                                    >
                                                        <CheckboxCard.HiddenInput />
                                                        <CheckboxCard.Control>
                                                            <CheckboxCard.Label>{item.label}</CheckboxCard.Label>
                                                            <CheckboxCard.Indicator />
                                                        </CheckboxCard.Control>
                                                    </CheckboxCard.Root>
                                                )}
                                            </For>
                                        </Flex>
                                    </Box>

                                    <Box w={"full"} marginBottom={"25px"}>
                                        <Field.Root>
                                            <Field.Label fontSize={"lg"}>Main Topics</Field.Label>
                                            <SearchableInput options={topics} placeholder="Choose topics you domain" onSelect={handleTopicChange}/>
                                        </Field.Root>
                                        <Show
                                            when={selectedTopic.length > 0}
                                        >
                                            <Flex
                                                gap={4}
                                                display="grid"
                                                gridTemplateColumns="repeat(4, 1fr)"
                                                gridAutoRows="auto"
                                                borderRadius={"sm"}
                                                p={5}
                                                mt={5}
                                                shadow={"inner"}
                                            >
                                                <For each={selectedTopic}>
                                                    {(item) => (
                                                        <Card.Root size="sm" key={item.value} borderWidth={"2px"} borderColor={colorMode === "light" ? "cyan.600":"pink.600"}>
                                                            <Card.Body display={"flex"} justifyContent={"center"}>
                                                                <Flex justifyContent={"space-between"} alignItems={"center"}>
                                                                    <Heading size="sm">{item.label}</Heading>
                                                                    <IconButton
                                                                        onClick={() => handleTopicChange(item, "remove")} 
                                                                        size={"2xs"} 
                                                                        bg={colorMode === "light" ? "cyan.600":"pink.600"}   
                                                                        color={"white"} 
                                                                        justifyContent={"center"}
                                                                        alignItems={"center"}
                                                                        fontSize={"sm"}
                                                                        borderRadius={"sm"}
                                                                    >
                                                                        X
                                                                    </IconButton>
                                                                </Flex>
                                                            </Card.Body>
                                                        </Card.Root>
                                                    )}
                                                </For>
                                            </Flex>
                                        </Show>
                                    </Box>

                                    <Box w={"full"}>
                                        <Field.Root>
                                            <Field.Label fontSize={"lg"}>Main Softwares</Field.Label>
                                            <SearchableInput options={softwares} placeholder="Choose softwares you domain" onSelect={handleSoftwareChange}/>
                                        </Field.Root>
                                        <Show
                                            when={selectedSoftware.length > 0}
                                        >
                                            <Flex
                                                gap={4}
                                                display="grid"
                                                gridTemplateColumns="repeat(4, 1fr)"
                                                gridAutoRows="auto"
                                                borderRadius={"sm"}
                                                p={5}
                                                mt={5}
                                                shadow={"inner"}
                                            >
                                                <For each={selectedSoftware}>
                                                    {(item) => (
                                                        <Card.Root size="sm" key={item.value} borderWidth={"2px"} borderColor={colorMode === "light" ? "cyan.600":"pink.600"}>
                                                            <Card.Body display={"flex"} justifyContent={"center"}>
                                                                <Flex justifyContent={"space-between"} alignItems={"center"}>
                                                                    <Heading size="md">{item.label}</Heading>
                                                                    <IconButton
                                                                        onClick={() => handleSoftwareChange(item, "remove")} 
                                                                        size={"2xs"} 
                                                                        bg={colorMode === "light" ? "cyan.600":"pink.600"}   
                                                                        color={"white"} 
                                                                        justifyContent={"center"}
                                                                        alignItems={"center"}
                                                                        fontSize={"sm"}
                                                                        borderRadius={"sm"}
                                                                    >
                                                                        X
                                                                    </IconButton>
                                                                </Flex>
                                                            </Card.Body>
                                                        </Card.Root>
                                                    )}
                                                </For>
                                            </Flex>
                                        </Show>
                                    </Box>

                                    <Button
                                        alignSelf={"flex-end"} 
                                        bg={"cyan.600"} 
                                        color={"white"}
                                        loading={storeUserSkillsLoading}
                                        disabled={storeUserSkillsLoading}
                                        onClick={onSubmitSkills}
                                    >
                                        <IoIosSave />Save
                                    </Button>
                                </Stack>
                            {/* </form> */}
                        </Show>
                    </Stack>
                </Show>
            )
        },
        {
            index: "3",
            title: "Social Media",
            icon: <PiShareNetworkFill />,
            content: (
                <Show
                    when={!socialMediaLoading && !userSocialMediaLoading}
                    fallback={
                        <LoadingProgress/>
                    }
                >
                    <Stack p={7}>
                        <Box w={"full"}>
                            <Box w={"full"} mb={3}>
                                <Heading size="3xl">Social Media</Heading>
                            </Box>
                            <Box w={"full"} mb={10}>
                                <Heading size="lg">Share your Contact & Social Media links</Heading>
                            </Box>
                        </Box>
                        <Show 
                            when={socialMediaData && userSocialMediaData}
                            fallback={
                                <label>
                                    Ooops...Please try it later!
                                </label>
                            }
                        >
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
                                                    <SearchableSelect disabled={socialMediaLoading} placeholder={"Select Social Netowrk"} options={socialMedia} field={field} multiple={false}/>
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
                                        <Show
                                            when={userSocialMedia.length > 0}
                                            fallback={
                                                <Show
                                                    when={userSocialMediaLoading || storeUserNetworkLoading}
                                                >
                                                    <LoadingProgress />
                                                </Show>
                                            }
                                        >
                                            <Stack gap={5}>
                                                <Text fontSize={"2xl"} fontWeight="bold" my={5}>Aggregated Social Media</Text>
                                                <For
                                                    each={userSocialMedia}
                                                >
                                                    {(item: ItemSocialMedia) => {
                                                        return (
                                                            <SocialMediaListItem 
                                                                key={item.userSocialNetworkId}
                                                                item={item} 
                                                                socialMedia={socialMedia}
                                                                socialMediaLoading={socialMediaLoading}
                                                            />
                                                        )
                                                    }}
                                                </For>
                                            </Stack>
                                        </Show>
                                    </Box>
                                </Stack>
                            </form>
                        </Show>
                    </Stack>
                </Show>
            )
        },
        {
            index: "4",
            title: "Password",
            icon: <RiLockPasswordFill />,
            content: (
                <Stack p={7}>
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

    return (
        <Box
            bg={colorMode === "light" ? "whiteAlpha.950" : "blackAlpha.500"}
            shadow={"lg"}
            rounded={"lg"}
            h={"full"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Grid w={"75vw"} templateColumns="35% 65%" p={10} h={"100%"}>
                <GridItem display="flex" justifyContent="center" alignItems="center" h={"100%"}>
                    <Stack>
                        <Box 
                            w="100%"
                            display={"flex"}
                            justifyContent="center" 
                            alignItems="center"
                            onClick={handleImageClick}
                        >
                            <Show
                                when={user && !storeUserPictureLoading}
                                fallback={
                                    <LoadingProgress/>
                                }
                            >
                                <Show
                                    when={user && user.avatar}
                                    fallback={
                                        <Icon
                                            as={ImUser}
                                            boxSize="200px"
                                            color={colorMode === 'light' ? 'cyan.50' : 'pink.200'}
                                            bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                                            rounded={'full'}
                                            cursor="pointer"
                                        />
                                    }
                                >
                                    <Image
                                        src={`${backendUrl}/avatars/${user?.avatar}`}
                                        alt="Stored Image"
                                        boxSize="200px"
                                        borderRadius="full"
                                        fit="cover"
                                        cursor="pointer"
                                    />
                                </Show>
                            </Show>
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
                <GridItem h={"100%"}>
                    <Tabs.Root
                        lazyMount
                        unmountOnExit
                        defaultValue="1"
                        orientation="vertical"
                        onValueChange={handleTab}
                        value={activeTab}
                        w={"full"}
                        variant={"plain"}
                        display={"flex"}
                        flexDirection={"row"}
                        h={"100%"}
                    >
                        <Tabs.List p={1} gap={3} overflowX="hidden" w={"25%"}>
                            <For each={items}>
                                {(item) => (
                                    <Tabs.Trigger
                                        key={item.index}
                                        value={item.index}
                                        _selected={{
                                            borderLeft: "4px solid",
                                            borderLeftColor:
                                                colorMode === "light" ? "cyan.600" : "pink.600",
                                            backgroundColor:
                                                colorMode === "light" ? "cyan.50" : "pink.200",
                                            color: "black",
                                        }}
                                        rounded={"xs"}
                                        bg={"none"}
                                    >
                                        <Box
                                            // position={"relative"}
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
                                                color={colorMode === "light" ? "cyan.600" : "pink.600"}
                                            >
                                                {item.icon}
                                            </Icon>
                                            <Text gap={2} truncate>
                                                {item.title}
                                            </Text>
                                        </Box>
                                    </Tabs.Trigger>
                                )}
                            </For>
                        </Tabs.List>
                        <Box w={"75%"} h={"100%"}>
                            <For
                                each={items}
                            >
                                {(item) => (
                                    <Tabs.Content
                                        key={item.index}
                                        value={item.index}
                                    >
                                        {item.content}
                                    </Tabs.Content>
                                )}
                            </For>
                        </Box>
                    </Tabs.Root>
                </GridItem>
            </Grid>
            <Show
                when={showAlert && message.message != ""}
            >
                <NotificationAlert
                    type={message.type}
                    title="Profile Settings"
                    message={message.message}
                    onClose={() => {
                        setMessage({message: "", type: undefined})
                        setShowAlert(false);
                    }}
                />
            </Show>
        </Box>
    );
};

export default ProfileSettings;