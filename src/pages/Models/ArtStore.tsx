import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import LoadingProgress from "@/custom/Components/LoadingProgress";
import SearchableSelect from "@/custom/Components/SearchableSelect";
import { useGetCategory } from "@/services/Category/CategoryService";
import { Box, Breadcrumb, Button, Checkbox, CheckboxCard, Dialog, Field, FileUpload, Flex, For, Grid, GridItem, Heading, Icon, Image, Input, Portal, Stack, Textarea } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArchive, FaCheckCircle } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { getCroppedImg } from "@/utils/CanvasCrop";
import { GrPowerReset } from "react-icons/gr";
import { FaCropSimple, FaNewspaper } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import NotificationAlert from "@/custom/Components/NotificationAlert";
import { useGetPublishing } from "@/services/Publishing/PublishingService";

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

const ArtStore = () => {
    const { getCategories, data: categoriesData, loading: categoriesLoading } = useGetCategory();
    const { getPublishing, data: publishingData, loading: publishingLoading } = useGetPublishing();

    const navigate = useNavigate();
    const { user } = useAuth();
    const { colorMode } = useColorMode();
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [publishing, setPublishing] = useState<PublishingOptions[]>([]);
    const [title, setTitle] = useState<string>('ArtWork');
    const [description, setDescription] = useState<string | null>(null);
    const [matureContent, setMatureContent] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
    const [imgURL, setImgURL] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(null);
    const [aspect, setAspect] = useState<number | undefined>(1 / 1)
    const [scale, setScale] = useState<number>(1)
    const [rotate, setRotate] = useState<number>(0)
    const imgRef = useRef<HTMLImageElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const {
        handleSubmit,
        formState: { errors },
        control: artWorkControl
    } = useForm<ArtWorkForm>();

    useEffect(() => {
        getCategories();
        getPublishing();
    }, []);

    useEffect(() => {
        if (categories.length <= 0 && categoriesData && categoriesData.getCategories) {
            const formattedCategories: CategoryOption[] = categoriesData.getCategories.map((category: any) => ({
                value: category.categoryId,
                label: category.name,
            }));

            setCategories(formattedCategories);
        }
    }, [categoriesData]);

    useEffect(() => {
        if (publishing.length <= 0 && publishingData && publishingData.getPublishing) {
            const formattedPublishing: PublishingOptions[] = publishingData.getPublishing.map((state: any) => ({
                value: state.publishingId,
                label: state.name,
            }));

            setPublishing(formattedPublishing);
        }
    }, [publishingData]);

    if (categoriesLoading) return <LoadingProgress />

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

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return null

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            setFileError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
            return;
        }

        if (file.size > maxSize) {
            setFileError('File size exceeds the limit of 5MB.');
            return;
        }
        
        setFileError(null);
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

        console.log(formData)
    });

    const handleSaveDraft = () => {
        const formData = {
            title: title,
            description: description,
            matureContent: matureContent,
            categories: selectedCategories,
            thumbnail: preview,
            status: 3,
        }

        console.log(formData)
    };

    const resetThumbnail = () => {
        setImgURL(null)
        setCompletedCrop(null)
        setPreview(null)
        setFileError(null)
    }

    return (
        <Box w={"auto"} h={"auto"} mx={5}>
            <Box mt={5}>
                <Breadcrumb.Root size={"lg"}>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link onClick={handleNavigate} color={colorMode === "light" ? "cyan.500" : "pink.500"}>Profile</Breadcrumb.Link>
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
                                <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.500" : "whiteAlpha.300"} shadow={"lg"}>
                                    <Box w={"full"} bg={colorMode === "light" ? "cyan.500" : "blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                                        <Heading fontSize={"lg"} color={"white"}>Title</Heading>
                                    </Box>
                                    <Stack mx={10} mt={5} mb={10}>
                                        <Field.Root>
                                            <Input size={"lg"} placeholder="Name your ArtWork..." onChange={(e) => setTitle(e.target.value)} />
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
                                            <Textarea resize="both" size={"lg"} placeholder="Describe your ArtWork..." onChange={(e) => setDescription(e.target.value)} />
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
                                        <Field.Root>
                                            <Field.Label fontSize={"lg"}>Software Used</Field.Label>
                                            <Textarea resize="both" size={"lg"} placeholder="Describe your ArtWork..." />
                                        </Field.Root>
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
                                            {!preview && (
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
                                            )}
                                            {preview && (
                                                <>
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
                                                            bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                        >
                                                            <FaCropSimple /> Crop
                                                        </Button>
                                                        <Button 
                                                            bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                            onClick={resetThumbnail}
                                                        > 
                                                            <GrPowerReset /> Reset
                                                        </Button>
                                                    </Box>
                                                </>
                                            )}
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
                                                            {imgURL && (
                                                                <Image
                                                                    ref={imgRef}
                                                                    alt="Image Crop"
                                                                    src={imgURL}
                                                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                                                    onLoad={onImageLoad}
                                                                />
                                                            )}
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
                                        {publishing.length > 0 && (
                                            <Field.Root invalid={!!errors.status}>
                                                <Field.Label fontSize={"lg"}>Status</Field.Label>
                                                <Controller
                                                    control={artWorkControl}
                                                    name="status"
                                                    rules={{ required: "Status is required" }}
                                                    render={({ field }) => (
                                                        <SearchableSelect options={publishing} field={field} defaultValue={null} />
                                                    )}
                                                />
                                                <Field.ErrorText>{errors.status?.message}</Field.ErrorText>
                                            </Field.Root>
                                        )}
                                        <Box display={"flex"} justifyContent={"space-between"} mt={3}>
                                            {publishing.length > 0 && (
                                                <Button
                                                    type="submit"
                                                    bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                >
                                                    <FaNewspaper /> Publish
                                                </Button>
                                            )}
                                            <Button
                                                bg={colorMode === "light" ? "cyan.500":"pink.500"}
                                                onClick={handleSaveDraft}
                                            >
                                                <FaArchive /> Archive
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Stack>
                        </GridItem>
                    </Grid>
                </form>
            </Box>
            {fileError && (
                <NotificationAlert
                    title="New ArtWork"
                    message={fileError}
                    type="error"
                    onClose={() => setFileError(null)}
                />
            )}
        </Box>
    )
}

export default ArtStore;