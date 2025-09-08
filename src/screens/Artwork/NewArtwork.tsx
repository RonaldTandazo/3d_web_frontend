import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import LoadingProgress from "@/custom/Components/LoadingProgress";
import SearchableSelect from "@/custom/Components/SearchableSelect";
import { Box, Breadcrumb, Button, Card, Checkbox, CheckboxCard, CloseButton, Dialog, Drawer, Field, FileUpload, Flex, For, Grid, GridItem, Heading, Icon, IconButton, Image, Input, Popover, Portal, Show, Spinner, Stack, Tabs, Text, Textarea } from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArchive, FaCheckCircle } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getCroppedImg } from "@/utils/CanvasCrop";
import { GrPowerReset } from "react-icons/gr";
import { FaCropSimple, FaNewspaper } from "react-icons/fa6";
import { Md3dRotation, MdCancel, MdSlowMotionVideo } from "react-icons/md";
import NotificationAlert from "@/custom/Components/NotificationAlert";
import SearchableInput from "@/custom/Components/SearchableInput";
import { useGetArtworkFormData, useStoreArtwork } from "@/services/Artwork/ArtworkService";
import { IoMdImages } from "react-icons/io";
import MultimediaCollector from "@/custom/Components/MultimediaCollector";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface ArtWorkForm {
    status: number;
}

interface CategoryOption {
    value: number;
    label: string;
}

interface PublishingOptions {
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

interface FileInterface {
    originalFile: string | undefined;
    crop: string | undefined;
}

interface MultimediaFiles {
    type: string;
    files: FileInterface[];
}

const NewArtwork = () => {
    const { storeArtwork: StoreArtwork, data: storeArtworkData, loading: storeArtworkLoading, error: storeArtworkError } = useStoreArtwork();
    const { getArtworkFormData: GetArtworkFormData, data: formDataData, loading: formDataLoading } = useGetArtworkFormData();

    const navigate = useNavigate();
    const { user } = useAuth();
    const { colorMode } = useColorMode();

    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [topics, setTopics] = useState<TopicOptions[]>([]);
    const [softwares, setSoftwares] = useState<SoftwareOptions[]>([]);
    const [publishing, setPublishing] = useState<PublishingOptions[]>([]);
    const [draft, setDraft] = useState<PublishingOptions | undefined>(undefined);
    const [schedule, setSchedule] = useState<PublishingOptions | undefined>(undefined);
    
    const [title, setTitle] = useState<string>('ArtWork');
    const [description, setDescription] = useState<string | undefined>(undefined);
    const [matureContent, setMatureContent] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<TopicOptions[]>([]);
    const [selectedSoftware, setSelectedSoftware] = useState<SoftwareOptions[]>([]);
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
    const [scheduleTime, setScheduleTime] = useState<string | undefined>(undefined);
    const formattedDate = scheduleDate ? scheduleDate.toLocaleDateString() : 'Set Date';
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
    const [imgURL, setImgURL] = useState<string | undefined>(undefined)
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [aspect] = useState<number | undefined>(1 / 1)
    const [scale] = useState<number>(1)
    const [rotate] = useState<number>(0)
    const imgRef = useRef<HTMLImageElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<string | null>("1");
    const [multimedia, setMultimedia] = useState<MultimediaFiles[]>([]);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [isOpenDatePicker, setIsOpenDatePicker] = useState<boolean>(false)

    const {
        handleSubmit,
        formState: { errors },
        control: artWorkControl,
        watch
    } = useForm<ArtWorkForm>();

    useEffect(() => {
        GetArtworkFormData();
    }, []);

    useEffect(() => {
        if (formDataData && formDataData.getArtworkFormData) {
            const { categories, publishing, softwares, topics } = formDataData.getArtworkFormData;

            const formattedCategories: CategoryOption[] = categories.map((category: any) => ({
                value: category.categoryId,
                label: category.name,
            }));

            setCategories(formattedCategories);

            const formattedPublishing: PublishingOptions[] = publishing.filter((item: any) => item.type == 'select')
            .map((state: any) => ({
                value: state.publishingId,
                label: state.name,
            }));

            setPublishing(formattedPublishing);

            const foundDraft = publishing.find((item: any) => item.type === 'draft');
            setDraft(
                foundDraft ? { 
                    label: foundDraft.name,
                    value: foundDraft.publishingId
                }
                : undefined
            )

            const foundSchedule = publishing.find((item: any) => item.type === 'schedule');
            setSchedule(
                foundSchedule ? { 
                    label: foundSchedule.name,
                    value: foundSchedule.publishingId
                }
                : undefined
            )

            const formattedSoftware: SoftwareOptions[] = softwares.map((software: any) => ({
                value: software.softwareId,
                label: software.name,
            }));

            setSoftwares(formattedSoftware);

            const formattedTopic: TopicOptions[] = topics.map((topic: any) => ({
                value: topic.topicId,
                label: topic.name,
            }));

            setTopics(formattedTopic);
        }
    }, [formDataData]);

    useEffect(() => {
        if (storeArtworkData && storeArtworkData.storeArtwork) {
           handleNavigate()
        }
    }, [storeArtworkData]);

    useEffect(() => {
        if(storeArtworkError?.message){
            handleError(storeArtworkError?.message);
        }
    }, [storeArtworkError]);

    const handleNavigate = () => {
        if(user){
            navigate(`/Profile/${user.username}`)
        }
    }

    const handleCategoryChange = (categoryId: number) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
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

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return null

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            const errorMessage = 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.';
            handleError(errorMessage)
            return;
        }
        
        if (file.size > maxSize) {
            const errorMessage = 'File size exceeds the limit of 5MB.';
            handleError(errorMessage)
            return;
        }
        
        handleError(undefined);
        setCrop(undefined)
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imgURL = reader.result?.toString() || '';
            setImgURL(imgURL)
        })

        reader.readAsDataURL(file)
        setIsModalOpen(true)
    };

    function centerAspectCrop(
        mediaWidth: number,
        mediaHeight: number,
        aspect: number,
    ) {
        return centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                aspect,
                mediaWidth,
                mediaHeight,
            ),
            mediaWidth,
            mediaHeight,
        )
    }

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if(aspect){
            const { width, height } = e.currentTarget    
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    const onCropChange = (newCrop: Crop) => {
        setCrop(newCrop);
    };

    const onComplete = async (crop:any) => {
        setCompletedCrop(crop);
        if (imgRef.current && completedCrop) {
            const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop, rotate, scale);
            setPreview(croppedImageUrl);
            setIsModalOpen(false);
        }
    };

    const handleDateSelect = (date: Date) => {
        console.log("date")
        console.log(date)
        setScheduleDate(date);
        setIsOpenDatePicker(false);
    };

    const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const time = e.target.value;
        setScheduleTime(time);
    };

    const structureData = async (type: string, data: any = null) => {
        handleError(undefined);
        const softwareIds = selectedSoftware.map(({ value }) => value);
        const topicIds = selectedTopic.map(({ value }) => value);

        const status = type == 'draft' ? draft?.value: type == 'schedule' ? schedule?.value:data.status[0];
        const isSchedule = status == 4 ? true:false;
        const publishingTargetStatus = isSchedule ? data.status[0]:null;

        const images = multimediaMap['images']?.map((file: FileInterface) => file.crop) ?? [];
        const videos = multimediaMap['videos'] ?? [];
        const file3d = multimediaMap['3d'] ?? '';

        const formData = {
            title: title,
            description: description,
            matureContent: matureContent,
            categories: selectedCategories,
            topics: topicIds,
            softwares: softwareIds,
            images: images,
            videos: videos,
            file3d: file3d,
            thumbnail: preview,
            publishing: status,
            schedule: isSchedule,
            publishingTargetStatus: publishingTargetStatus,
            scheduleDate: scheduleDate,
            scheduleTime: scheduleTime
        }

        console.log(formData)

        return formData;
    }

    const onSubmit = handleSubmit(async (data: any) => {
        const storeData = await structureData('post', data)
        await StoreArtwork(storeData)
    });

    const handleSchedulePost = handleSubmit(async (data: any) => {
        if(!scheduleDate){
            handleError('You must establish Date for scheduling')
            return;
        }

        if(!scheduleTime){  
            handleError('You must establish Time for scheduling')
            return;
        }
        
        const storeData = await structureData('schedule', data)
        await StoreArtwork(storeData)
    });

    const handleSaveDraft = async () => {
        const storeData = await structureData('draft', null)
        await StoreArtwork(storeData)
    };

    const resetThumbnail = () => {
        setImgURL(undefined);
        setCompletedCrop(null);
        setPreview(undefined);
        handleError(undefined);
    }

    const handleTab = (e: any) => {
        setActiveTab(e.value);
    };

    const handleMultimediaUpdate = (type: string, files: []) => {
        const existType = multimedia?.find((item) => item.type == type)
        if(existType){
            const updatedMultimedia = multimedia?.map((item) =>
                item.type === type ? { ...item, files: files } : item
            );
            setMultimedia(updatedMultimedia);
        }else{
            const newType = {
                type,
                files
            }
            setMultimedia([...multimedia, newType])
        }
    }

    const handleError = (errorMessage: string | undefined) => {
        setError(errorMessage)
    }

    const multimediaMap = multimedia.reduce((acc: any, current: MultimediaFiles) => {
        acc[current.type] = current.files;
        return acc;
    }, {});

    const tabs = [
        {
            index: "1",
            title: "Images",
            icon: <IoMdImages />,
            content: (
                <MultimediaCollector 
                    type='images' 
                    files={multimediaMap['images'] ?? []} 
                    onUpdate={handleMultimediaUpdate}
                    onError={handleError}
                />
            )
        },
        {
            index: "2",
            title: "Videos",
            icon: <MdSlowMotionVideo />,
            content: (
                <MultimediaCollector 
                    type='videos' 
                    files={multimediaMap['videos'] ?? []} 
                    onUpdate={handleMultimediaUpdate}
                    onError={handleError}
                />
            )
        },
        {
            index: "3",
            title: "3D Viewer",
            icon: <Md3dRotation />,
            content: (
                <>3D</>
            )
        }
    ];

    return (
        <Show
            when={!formDataLoading}
            fallback={
                <LoadingProgress />
            }
        >
            <Box w={"auto"} h={"auto"} pb={5}>
                <Show when={storeArtworkLoading}>
                    <Box
                        position="fixed"
                        top="0"
                        left="0"
                        width="100vw"
                        height="100vh"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        backgroundColor="rgba(0, 0, 0, 0.25)"
                        zIndex="tooltip"
                    >
                        <Spinner size="xl" color={colorMode === "light" ? "cyan.600":"pink.600"} borderWidth="5px"/>
                    </Box>
                </Show>
                <Box mt={0}>
                    <Breadcrumb.Root size={"lg"}>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                <Breadcrumb.Link onClick={handleNavigate} color={colorMode === "light" ? "cyan.600" : "pink.600"}>Profile</Breadcrumb.Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator />
                            <Breadcrumb.Item>
                                <Breadcrumb.CurrentLink>New ArtWork</Breadcrumb.CurrentLink>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                    <Heading my={10} size={"4xl"}>{title != '' ? title : 'ArtWork'}</Heading>
                    <form onSubmit={onSubmit}>
                        <Grid
                            templateColumns={"4fr 1fr"}
                            maxW={"100vw"}
                            gap={50}
                            alignItems={"start"}
                        >
                            <GridItem>
                                <Stack gap={10} h={"auto"}>
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.600" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.600" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Title</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10}>
                                            <Field.Root>
                                                <Input size={"lg"} placeholder="Name your ArtWork..." onChange={(e) => setTitle((e.target.value).trim())} />
                                            </Field.Root>
                                        </Stack>
                                    </Box>
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.600" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.600" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Details</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10} gap={10}>
                                            <Field.Root>
                                                <Field.Label fontSize={"lg"}>Description</Field.Label>
                                                <Textarea resize="both" size={"lg"} placeholder="Describe your ArtWork..." onChange={(e) => setDescription((e.target.value).trim())} />
                                            </Field.Root>
                                            <Field.Root>
                                                <Field.Label fontSize={"lg"}>Mature Content</Field.Label>
                                                <Checkbox.Root
                                                    variant={"solid"}
                                                    colorPalette={colorMode === "light" ? "cyan" : "pink"}
                                                    onCheckedChange={(e) => setMatureContent(e.checked === true)}
                                                    checked={matureContent}
                                                    cursor="pointer"
                                                >
                                                    <Checkbox.HiddenInput />
                                                    <Checkbox.Control />
                                                    <Checkbox.Label>Has mature content? (nudes, weapons, blood, drugs...etc)</Checkbox.Label>
                                                </Checkbox.Root>
                                            </Field.Root>
                                        </Stack>
                                    </Box>
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.600" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.600" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Categoritzation</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10} gap={10}>
                                            <Box w={"full"}>
                                                <Field.Root>
                                                    <Field.Label fontSize={"lg"}>Categories</Field.Label>
                                                </Field.Root>
                                                <Flex
                                                    gap={4}
                                                    display="grid"
                                                    gridTemplateColumns="repeat(6, 1fr)"
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
                                            <Box w={"full"}>
                                                <Field.Root>
                                                    <Field.Label fontSize={"lg"}>Topics</Field.Label>
                                                    <SearchableInput options={topics} placeholder="Choose topics related..." onSelect={handleTopicChange}/>
                                                </Field.Root>
                                                <Show
                                                    when={selectedTopic.length > 0}
                                                >
                                                    <Flex
                                                        gap={4}
                                                        display="grid"
                                                        gridTemplateColumns="repeat(8, 1fr)"
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
                                                    <Field.Label fontSize={"lg"}>Software Used</Field.Label>
                                                    <SearchableInput options={softwares} placeholder="Choose software used..." onSelect={handleSoftwareChange}/>
                                                </Field.Root>
                                                <Show
                                                    when={selectedSoftware.length > 0}
                                                >
                                                    <Flex
                                                        gap={4}
                                                        display="grid"
                                                        gridTemplateColumns="repeat(8, 1fr)"
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
                                                                            <Heading size="sm">{item.label}</Heading>
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
                                        </Stack>
                                    </Box>
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.600" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.600" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Multimedia</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10} gap={10}>
                                            <Tabs.Root
                                                lazyMount
                                                unmountOnExit
                                                defaultValue="1"
                                                orientation="horizontal"
                                                onValueChange={handleTab}
                                                value={activeTab}
                                                w={"full"}
                                                variant="plain"
                                            >
                                                <Tabs.List p={1} gap={3} overflowX="hidden" w={"auto"} bg={colorMode == 'light' ? "white":"black"}>
                                                    <For each={tabs}>
                                                        {(tab) => (
                                                            <Tabs.Trigger
                                                                key={tab.index}
                                                                value={tab.index}
                                                                _selected={{
                                                                    borderLeft: "4px solid",
                                                                    borderLeftColor:
                                                                        colorMode === "light" ? "cyan.600" : "pink.600",
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
                                                                    cursor={"pointer"}
                                                                >
                                                                    <Icon
                                                                        size={"md"}
                                                                        color={colorMode === "light" ? "cyan.600" : "pink.600"}
                                                                    >
                                                                        {tab.icon}
                                                                    </Icon>
                                                                    <Text>
                                                                        {tab.title}
                                                                    </Text>
                                                                </Box>
                                                            </Tabs.Trigger>

                                                        )}
                                                    </For>
                                                </Tabs.List>
                                                <Box w={"full"} h={"auto"}>
                                                    <For each={tabs}>
                                                        {(tab) => (
                                                            <Tabs.Content
                                                                key={tab.index}
                                                                value={tab.index}
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
                                                                {tab.content}
                                                            </Tabs.Content>
                                                        )}
                                                    </For>
                                                </Box>
                                            </Tabs.Root>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </GridItem>
                            <GridItem>
                                <Stack gap={10} h={"auto"}>
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.600" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.600" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Thumbnail</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10}>
                                            <Field.Root>
                                                <Show when={!preview}>
                                                    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1} accept={["image/png", "image/jpeg", "image/gif", "image/webp"]} w={"full"} h={"full"} cursor={"pointer"}>
                                                        <FileUpload.HiddenInput onChange={(files) => handleFileChange(files)} />
                                                        <FileUpload.Dropzone>
                                                            <Icon size="md" color="fg.muted">
                                                                <LuUpload />
                                                            </Icon>
                                                            <FileUpload.DropzoneContent>
                                                                <Box>Drag and drop files here</Box>
                                                                <Box color="fg.muted">.png, .jpg, .gif, .webp up to 5MB</Box>
                                                            </FileUpload.DropzoneContent>
                                                        </FileUpload.Dropzone>
                                                        <FileUpload.List />
                                                    </FileUpload.Root>
                                                </Show>
                                                <Show when={preview}>
                                                    <Box w="full" h="full" display={"flex"} justifyContent={"center"}  alignItems={"center"}>
                                                        <Image 
                                                            src={preview} 
                                                            alt="Image Preview" 
                                                            w="full" 
                                                            h="full" 
                                                            objectFit="cover" 
                                                            borderRadius={"md"}
                                                            cursor="pointer"
                                                            onClick={handleImageClick}
                                                        />
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                            accept="image/jpeg, image/png, image/gif, image/webp"
                                                        />
                                                    </Box>
                                                    <Box w={"full"} h={"full"} display={"flex"} justifyContent={"space-between"}  alignItems={"center"} mt={3}>
                                                        <Button
                                                            bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                                            color={"whiteAlpha.950"}
                                                            >
                                                            <FaCropSimple /> Crop
                                                        </Button>
                                                        <Button 
                                                            bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                                            color={"whiteAlpha.950"}
                                                            onClick={resetThumbnail}
                                                        > 
                                                            <GrPowerReset /> Reset
                                                        </Button>
                                                    </Box>
                                                </Show>
                                            </Field.Root>
                                        </Stack>

                                        <Dialog.Root open={isModalOpen} size={"md"}>
                                            <Portal>
                                                <Dialog.Backdrop />
                                                <Dialog.Positioner>
                                                    <Dialog.Content>
                                                        <Dialog.Header bg={colorMode === "light" ? "cyan.600":"blackAlpha.500"}>
                                                            <Dialog.Title>Crop Image</Dialog.Title>
                                                        </Dialog.Header>
                                                        <Dialog.Body w={"full"} h={"full"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                                            <ReactCrop
                                                                crop={crop}
                                                                aspect={aspect}
                                                                minHeight={100}
                                                                onChange={onCropChange}
                                                                onComplete={(c) => setCompletedCrop(c)}
                                                                keepSelection
                                                            >
                                                                <Show when={imgURL}>
                                                                    <Image
                                                                        ref={imgRef}
                                                                        alt="Image Crop"
                                                                        src={imgURL}
                                                                        style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                                                        onLoad={onImageLoad}
                                                                    />
                                                                </Show>
                                                            </ReactCrop>
                                                        </Dialog.Body>
                                                        <Dialog.Footer>
                                                            <Dialog.ActionTrigger asChild>
                                                                <Button 
                                                                    bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                                                    color={"whiteAlpha.950"}
                                                                    onClick={() => {
                                                                        setIsModalOpen(false)
                                                                    }}
                                                                >
                                                                    <MdCancel /> Cancel
                                                                </Button>
                                                            </Dialog.ActionTrigger>
                                                            <Button 
                                                                bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                                                color={"whiteAlpha.950"}
                                                                onClick={onComplete}
                                                            >
                                                                <FaCheckCircle /> Confirm
                                                            </Button>
                                                        </Dialog.Footer>
                                                    </Dialog.Content>
                                                </Dialog.Positioner>
                                            </Portal>
                                        </Dialog.Root>
                                    </Box>
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.600" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.600" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Publishing</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10}>
                                            <Show when={publishing.length > 0}>
                                                <Field.Root invalid={!!errors.status}>
                                                    <Field.Label fontSize={"lg"}>Status</Field.Label>
                                                    <Controller
                                                        control={artWorkControl}
                                                        name="status"
                                                        // rules={{ required: "Status is required" }}
                                                        render={({ field }) => (
                                                            <SearchableSelect options={publishing} field={field} />
                                                        )}
                                                    />
                                                    <Field.ErrorText>{errors.status?.message}</Field.ErrorText>
                                                </Field.Root>
                                            </Show>
                                            <Box display={"flex"} justifyContent={watch('status') ? "space-between":"flex-end"} mt={3}>
                                                <Show when={publishing.length > 0 && watch('status')}>
                                                    <Show
                                                        when={schedule}
                                                    >
                                                        <Drawer.Root open={openDrawer} onOpenChange={(e) => setOpenDrawer(e.open)} placement={"start"} size={"sm"}>
                                                            <Drawer.Trigger asChild>
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                                                    color={"whiteAlpha.950"}
                                                                    maxW={"45%"}
                                                                >
                                                                    <RiCalendarScheduleFill />
                                                                    {schedule?.label}
                                                                </Button>
                                                            </Drawer.Trigger>
                                                            <Portal>
                                                                <Drawer.Backdrop />
                                                                <Drawer.Positioner>
                                                                    <Drawer.Content>
                                                                        <Drawer.Header>
                                                                            <Drawer.Title color={colorMode == 'light' ? 'black':'white'}>Schedule Post</Drawer.Title>
                                                                        </Drawer.Header>
                                                                        <Drawer.Body>
                                                                            <Text color={colorMode == 'light' ? 'black':'white'}>
                                                                                Set the date and time when your artwork will be published
                                                                            </Text>
                                                                            <Box mt={25}>
                                                                                <Box>
                                                                                    <Text mb={1} color={colorMode == 'light' ? 'black':'white'}>Date</Text>
                                                                                    <Popover.Root open={isOpenDatePicker} onFocusOutside={() => setIsOpenDatePicker(false)}>
                                                                                        <Popover.Trigger asChild>
                                                                                            <Input
                                                                                                color={colorMode == 'light' ? 'black':'white'}
                                                                                                value={formattedDate}
                                                                                                placeholder="Set Date"
                                                                                                readOnly
                                                                                                cursor="pointer"
                                                                                                onClick={() => setIsOpenDatePicker(true)}
                                                                                            />
                                                                                        </Popover.Trigger>
                                                                                        <Portal>
                                                                                            <Popover.Positioner>
                                                                                                <Popover.Content>
                                                                                                    <Popover.Arrow />
                                                                                                    <Popover.Body>
                                                                                                        <DayPicker
                                                                                                            mode="single"
                                                                                                            selected={scheduleDate}
                                                                                                            onSelect={handleDateSelect}
                                                                                                            style={{
                                                                                                                color: colorMode == "light" ? "black":"white"
                                                                                                            }}
                                                                                                            captionLayout={"dropdown"}
                                                                                                            navLayout={"around"}
                                                                                                            required
                                                                                                        />
                                                                                                    </Popover.Body>
                                                                                                </Popover.Content>
                                                                                            </Popover.Positioner>
                                                                                        </Portal>
                                                                                    </Popover.Root>
                                                                                </Box>
                                                                                <Box mt={5}>
                                                                                    <Text mb={1} color={colorMode == 'light' ? 'black':'white'}>Time</Text>
                                                                                    <Input
                                                                                        type="time"
                                                                                        placeholder="Set Time"
                                                                                        value={scheduleTime} 
                                                                                        onChange={handleTimeChange}
                                                                                        cursor="pointer"
                                                                                        color={colorMode == 'light' ? 'black':'white'}
                                                                                    />
                                                                                </Box>
                                                                            </Box>
                                                                        </Drawer.Body>
                                                                        <Drawer.Footer>
                                                                            <Button 
                                                                                color={colorMode == 'light' ? 'cyan.600':'white'}
                                                                                bg={colorMode == 'light' ? 'white':'black'}
                                                                                borderColor={colorMode == 'light' ? 'cyan.600':'white'}
                                                                                onClick={() => setOpenDrawer(false)}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                                                                color={"whiteAlpha.950"}
                                                                                maxW={"45%"}
                                                                                onClick={handleSchedulePost}
                                                                            >
                                                                                Schedule
                                                                            </Button>
                                                                        </Drawer.Footer>
                                                                        <Drawer.CloseTrigger asChild>
                                                                            <CloseButton 
                                                                                size="sm"
                                                                                color={colorMode == 'light' ? 'cyan.600':'white'}
                                                                                bg={colorMode == 'light' ? 'white':'black'}
                                                                                borderColor={colorMode == 'light' ? 'cyan.600':'white'} 
                                                                            />
                                                                        </Drawer.CloseTrigger>
                                                                    </Drawer.Content>
                                                                </Drawer.Positioner>
                                                            </Portal>
                                                        </Drawer.Root>
                                                    </Show>
                                                    <Button
                                                        bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                                        color={"whiteAlpha.950"}
                                                        type="submit"
                                                        maxW={"45%"}
                                                    >
                                                        <FaNewspaper /> Post
                                                    </Button>
                                                </Show>
                                                <Show
                                                    when={!watch('status') && draft}
                                                >
                                                    <Button
                                                        bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                                        color={"whiteAlpha.950"}
                                                        onClick={handleSaveDraft}
                                                    >
                                                        <FaArchive /> {draft?.label}
                                                    </Button>
                                                </Show>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </GridItem>
                        </Grid>
                    </form>
                </Box>
                <Show when={error}>
                    <NotificationAlert
                        title="New ArtWork"
                        message={error}
                        type="error"
                        onClose={() => handleError(undefined)}
                    />
                </Show>
            </Box>
        </Show>
    )
}

export default NewArtwork;