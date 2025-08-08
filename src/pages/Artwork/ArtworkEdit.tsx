import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import LoadingProgress from "@/custom/Components/LoadingProgress";
import SearchableSelect from "@/custom/Components/SearchableSelect";
import { Box, Breadcrumb, Button, Card, Checkbox, CheckboxCard, Dialog, Field, FileUpload, Flex, For, Grid, GridItem, Heading, Icon, IconButton, Image, Input, Portal, Show, Spinner, Stack, Textarea } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosSave } from 'react-icons/io';
import { LuUpload } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getCroppedImg } from "@/utils/CanvasCrop";
import { GrPowerReset } from "react-icons/gr";
import { FaCropSimple, FaNewspaper } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import NotificationAlert from "@/custom/Components/NotificationAlert";
import SearchableInput from "@/custom/Components/SearchableInput";
import { useGetArtworkDetails, useGetArtworkFormData, useStoreArtwork } from "@/services/Artwork/ArtworkService";
import { decodeFromBase64 } from "@/utils/Helpers";

interface ArtWorkForm {
    status: number[];
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

const backendUrl = import.meta.env.VITE_API_URL;

const ArtworkEdit = () => {
    const { artworkId } = useParams();

    const { storeArtwork: StoreArtwork, data: storeArtworkData, loading: storeArtworkLoading, error: storeArtworkError } = useStoreArtwork();
    const { getArtworkDetails: GetArtworkDetails, data: artworkDetailsData, loading: artworkDetailsLoading } = useGetArtworkDetails();
    const { getArtworkFormData: GetArtworkFormData, data: formDataData, loading: formDataLoading } = useGetArtworkFormData();

    const navigate = useNavigate();
    const { user } = useAuth();
    const { colorMode } = useColorMode();
    
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [topics, setTopics] = useState<TopicOptions[]>([]);
    const [softwares, setSoftwares] = useState<SoftwareOptions[]>([]);
    const [publishing, setPublishing] = useState<PublishingOptions[]>([]);
    
    const [title, setTitle] = useState<string | undefined>(undefined);
    const [description, setDescription] = useState<string | undefined>(undefined);
    const [matureContent, setMatureContent] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<TopicOptions[]>([]);
    const [selectedSoftware, setSelectedSoftware] = useState<SoftwareOptions[]>([]);
    const [selectedPublishing, setSelectedPublishing] = useState<number | undefined>(undefined);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
    const [imgURL, setImgURL] = useState<string | undefined>(undefined)
    const [preview, setPreview] = useState<string | undefined>(undefined);
    const [aspect, setAspect] = useState<number | undefined>(1 / 1)
    const [scale, setScale] = useState<number>(1)
    const [rotate, setRotate] = useState<number>(0)
    const imgRef = useRef<HTMLImageElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | undefined>(undefined);

    const {
        handleSubmit,
        formState: { errors },
        control: artWorkControl
    } = useForm<ArtWorkForm>();

    useEffect(() => {
        const artworkDecodedId = parseInt(decodeFromBase64(artworkId));
        
        GetArtworkFormData();
        GetArtworkDetails(artworkDecodedId)
    }, []);

    useEffect(() => {
        if (formDataData && formDataData.getArtworkFormData) {
            const { categories, publishing, softwares, topics } = formDataData.getArtworkFormData;

            const formattedCategories: CategoryOption[] = categories.map((category: any) => ({
                value: category.categoryId,
                label: category.name,
            }));

            setCategories(formattedCategories);

            const formattedPublishing: PublishingOptions[] = publishing.filter((item: any) => item.name != 'Draft')
            .map((state: any) => ({
                value: state.publishingId,
                label: state.name,
            }));

            setPublishing(formattedPublishing);

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
        if(artworkDetailsData && artworkDetailsData.getArtworkDetails){
            setTitle(artworkDetailsData.getArtworkDetails.title)
            setDescription(artworkDetailsData.getArtworkDetails.description)
            setMatureContent(artworkDetailsData.getArtworkDetails.matureContent)
            setSelectedCategories(artworkDetailsData.getArtworkDetails.categories)
            setSelectedTopic(artworkDetailsData.getArtworkDetails.topics)
            setSelectedSoftware(artworkDetailsData.getArtworkDetails.softwares)
            setSelectedPublishing(artworkDetailsData.getArtworkDetails.publishingId)
            artworkDetailsData.getArtworkDetails.thumbnail ? setPreview(`${backendUrl}/thumbnails/${artworkDetailsData.getArtworkDetails.thumbnail}`):null
        }
    }, [artworkDetailsData])

    useEffect(() => {
        if (storeArtworkData && storeArtworkData.storeArtwork) {
           handleNavigate()
        }
    }, [storeArtworkData]);

    useEffect(() => {
        if(storeArtworkError?.message){
            setError(storeArtworkError?.message);
        }
    }, [storeArtworkError]);

    if (formDataLoading || artworkDetailsLoading) return <LoadingProgress />

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

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return null

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
            return;
        }

        if (file.size > maxSize) {
            setError('File size exceeds the limit of 5MB.');
            return;
        }
        
        setError(undefined);
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
            const croppedImageUrl = await getCroppedImg(imgRef.current, completedCrop, rotate, scale);
            setPreview(croppedImageUrl);
            setIsModalOpen(false);
        }
    };

    const onSubmit = handleSubmit(async (data: any) => {
        const formData = {
            title: title,
            description: description,
            matureContent: matureContent,
            categories: selectedCategories,
            thumbnail: preview,
            status: data.status[0],
        }
    });

    const handleSaveDraft = async() => {
        const softwareIds = selectedSoftware.map(({ value }) => value);
        
        const artworkData = {
            title: title,
            description: description,
            matureContent: matureContent,
            categories: selectedCategories,
            softwares: softwareIds,
            thumbnail: preview,
            publishing: 3,
        }

        await StoreArtwork(artworkData)
    };

    const resetThumbnail = () => {
        setImgURL(undefined)
        setCompletedCrop(null)
        setPreview(undefined)
        setError(undefined)
    }

    return (
        <Show
            when={!formDataLoading || !artworkDetailsLoading}
            fallback={
                <LoadingProgress />
            }
        >
            <Box w={"auto"} h={"auto"}>
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
                        <Spinner size="xl" color={colorMode === "light" ? "cyan.500":"pink.500"} borderWidth="5px"/>
                    </Box>
                </Show>
                <Box mt={5}>
                    <Breadcrumb.Root size={"lg"}>
                        <Breadcrumb.List>
                            <Breadcrumb.Item>
                                <Breadcrumb.Link onClick={handleNavigate} color={colorMode === "light" ? "cyan.500" : "pink.500"}>Profile</Breadcrumb.Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator />
                            <Breadcrumb.Item>
                                <Breadcrumb.CurrentLink>Artworks</Breadcrumb.CurrentLink>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator />
                            <Breadcrumb.Item>
                                <Breadcrumb.CurrentLink>{title}</Breadcrumb.CurrentLink>
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
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.500" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.500" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Title</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10}>
                                            <Field.Root>
                                                <Input size={"lg"} placeholder="Name your ArtWork..." onChange={(e) => setTitle(e.target.value)} defaultValue={title}/>
                                            </Field.Root>
                                        </Stack>
                                    </Box>
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.500" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.500" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Details</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10} gap={10}>
                                            <Field.Root>
                                                <Field.Label fontSize={"lg"}>Description</Field.Label>
                                                <Textarea resize="both" size={"lg"} placeholder="Describe your ArtWork..." onChange={(e) => setDescription(e.target.value)} defaultValue={description}/>
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
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.500" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.500" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Categoritzation</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10} gap={10}>
                                            <Show when={categories.length > 0}>
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
                                            </Show>
                                            <Show when={topics.length > 0}>
                                                <Box w={"full"}>
                                                    <Field.Root>
                                                        <Field.Label fontSize={"lg"}>Topics</Field.Label>
                                                        <SearchableInput options={topics} placeholder="Choose related topics..." onSelect={handleTopicChange}/>
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
                                                                                    bg={colorMode === "light" ? "cyan.500":"pink.500"}   
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
                                            </Show>
                                            <Show when={softwares.length > 0}>
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
                                                                                <Heading size="md">{item.label}</Heading>
                                                                                <IconButton
                                                                                    onClick={() => handleSoftwareChange(item, "remove")} 
                                                                                    size={"2xs"} 
                                                                                    bg={colorMode === "light" ? "cyan.500":"pink.500"}   
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
                                            </Show>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </GridItem>
                            <GridItem>
                                <Stack gap={10} h={"auto"}>
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.500" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.500" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Thumbnail</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10}>
                                            <Field.Root>
                                                <Show when={!preview}>
                                                    <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1} accept={["image/png", "image/jpeg", "image/gif", "image/webp"]} w={"full"} h={"full"}>
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
                                                    <Box w={"full"} h={"full"} display={"flex"} justifyContent={imgURL ? "space-between":"flex-end"}  alignItems={"center"} mt={3}>
                                                        <Show when={imgURL}>
                                                            <Button
                                                                bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                            >
                                                                <FaCropSimple /> Crop
                                                            </Button>
                                                        </Show>
                                                        <Button 
                                                            bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                            onClick={resetThumbnail}
                                                        > 
                                                            <GrPowerReset /> Reset
                                                        </Button>
                                                    </Box>
                                                </Show>
                                            </Field.Root>
                                        </Stack>

                                        <Dialog.Root open={isModalOpen} size={"xl"}>
                                            <Portal>
                                                <Dialog.Backdrop />
                                                <Dialog.Positioner>
                                                    <Dialog.Content>
                                                        <Dialog.Header bg={colorMode === "light" ? "cyan.500":"blackAlpha.500"}>
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
                                                                    bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                                    onClick={() => {
                                                                        setIsModalOpen(false)
                                                                    }}
                                                                >
                                                                    <MdCancel /> Cancel
                                                                </Button>
                                                            </Dialog.ActionTrigger>
                                                            <Button 
                                                                bg={colorMode === "light" ? "cyan.500":"pink.500"}
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
                                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.500" : "whiteAlpha.300"} shadow={"lg"}>
                                        <Box w={"full"} bg={colorMode === "light" ? "cyan.500" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                            <Heading fontSize={"lg"} color={"white"}>Publishing</Heading>
                                        </Box>
                                        <Stack mx={10} mt={5} mb={10}>
                                            <Show when={publishing.length > 0}>  
                                                <Field.Root invalid={!!errors.status}>
                                                    <Field.Label fontSize={"lg"}>Status</Field.Label>
                                                    <Controller
                                                        control={artWorkControl}
                                                        name="status"
                                                        rules={{ required: "Status is required" }}
                                                        render={({ field }) => (
                                                            <SearchableSelect options={publishing} field={field} defaultValue={publishing.find((item) => item.value === selectedPublishing) ? selectedPublishing:null} />
                                                        )}
                                                    />
                                                    <Field.ErrorText>{errors.status?.message}</Field.ErrorText>
                                                </Field.Root>
                                            </Show>
                                            <Box display={"flex"} justifyContent={selectedPublishing !== 3 ? "flex-end":publishing.length > 0 ? "space-between":"flex-end"} mt={3}>
                                                <Show 
                                                    when={selectedPublishing === 3}
                                                    fallback={
                                                        <Show when={publishing.length > 0}>
                                                            <Button
                                                                type="submit"
                                                                bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                            >
                                                                <FaNewspaper /> Save
                                                            </Button>                                                
                                                        </Show>
                                                    }
                                                >
                                                    <Show when={publishing.length > 0}>
                                                        <Button
                                                            type="submit"
                                                            bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                        >
                                                            <FaNewspaper /> Publish
                                                        </Button>                                               
                                                    </Show>
                                                    <Button
                                                        type="submit"
                                                        bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                    >
                                                        <IoIosSave /> Save
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
                        onClose={() => setError(undefined)}
                    />
                </Show>
            </Box>
        </Show>
    )
}

export default ArtworkEdit;