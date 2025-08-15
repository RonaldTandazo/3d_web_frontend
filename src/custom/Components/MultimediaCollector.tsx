import { useColorMode } from '@/components/ui/color-mode';
import { Tooltip } from '@/components/ui/tooltip';
import { getCroppedImg } from '@/utils/CanvasCrop';
import { Box, Button, Dialog, FileUpload, Flex, For, Grid, GridItem, Icon, Image, Portal, Show } from '@chakra-ui/react';
import { ChangeEvent, useRef, useState } from 'react'
import { FaCheckCircle, FaTrash } from 'react-icons/fa';
import { FaCropSimple } from 'react-icons/fa6';
import { LuUpload } from 'react-icons/lu';
import { MdCancel } from 'react-icons/md';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop'

type ImageFile = {
    originalFile: string;
    crop: string;
};

const MultimediaCollector = () => {
    const [files, setFiles] = useState<ImageFile[]>([]);
    const [crop, setCrop] = useState<Crop>()
    const [imgURL, setImgURL] = useState<string | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
    const [aspect, setAspect] = useState<number | undefined>(1 / 1)
    const [scale, setScale] = useState<number>(1)
    const [rotate, setRotate] = useState<number>(0)
    const imgRef = useRef<HTMLImageElement>(null)
    const { colorMode } = useColorMode();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recropIndex, setRecropIndex] = useState<number | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return null;

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
        setCrop(undefined);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const imgURL = reader.result?.toString() || '';
            setImgURL(imgURL);
        })

        reader.readAsDataURL(file);
        setIsModalOpen(true);
        setRecropIndex(null);
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
            if (recropIndex !== null) {
                const newFiles = [...files];
                newFiles[recropIndex].crop = croppedImageUrl;       
                setFiles(newFiles);
                setRecropIndex(null);
            } else {
                const newFileObject = {
                    originalFile: imgURL,
                    crop: croppedImageUrl,
                };
                setFiles([...files, newFileObject]);
            }

            setIsModalOpen(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setImgURL(undefined);
            setCrop(undefined);
            setCompletedCrop(null);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setImgURL(undefined);
        setCrop(undefined);
        setCompletedCrop(null);
        setRecropIndex(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        const newFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(newFiles);
    }

    const handleCrop = (index: number) => {
        const fileToRecrop = files[index];
        setImgURL(fileToRecrop.originalFile);
        setIsModalOpen(true);
        setRecropIndex(index);
        setCrop(undefined);
        setCompletedCrop(null);
    }

    return (
        <Flex
            gap={4}
            display="grid"
            gridTemplateColumns="repeat(6, 1fr)"
            gridAutoRows="auto"
            borderRadius={"sm"}
            p={5}
            mt={5}
            shadow={"inner"}
        >
            <For each={files}>
                {(file, index) => (
                    <Box
                        w={"full"}
                        h={"full"}
                        key={index}
                    >
                        <Box
                            cursor={"pointer"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            bg={colorMode === 'light' ? 'cyan.500' : 'pink.500'}
                            color={'whiteAlpha.950'}
                        >
                            <Image
                                src={file.crop} 
                                alt="File Preview"
                                //objectFit="cover" 
                                cursor="pointer"
                            />
                        </Box>
                        <Box 
                            p={2} 
                            bg={colorMode === "light" ? "blackAlpha.300":"blackAlpha.950"}
                        >
                            <Grid
                                templateColumns="repeat(2, 1fr)"
                                display={"flex"}
                                justifyContent={"space-around"}
                                alignItems={"center"} 
                            >
                                <Tooltip
                                    content={"Crop"}
                                    openDelay={500}
                                    closeDelay={100}
                                    unmountOnExit={true}    
                                    lazyMount={true}
                                    positioning={{ placement: "top" }}
                                    showArrow
                                    contentProps={{ 
                                        css: { 
                                            "--tooltip-bg": colorMode === "light" ? "colors.cyan.500":"colors.pink.500",
                                            'color': 'white'
                                        }
                                    }}
                                >    
                                    <GridItem
                                        colSpan={1} 
                                        display={"flex"} 
                                        alignItems={"center"} 
                                        justifyContent={"space-around"}
                                    >
                                        <Icon
                                            as={FaCropSimple}
                                            cursor="pointer"
                                            size={"md"}
                                            color={colorMode == 'light' ? "black":"white"}
                                            onClick={() => handleCrop(index)}
                                        />
                                    </GridItem>
                                </Tooltip>
                                <Tooltip
                                    content={"Remove"}
                                    openDelay={500}
                                    closeDelay={100}
                                    unmountOnExit={true}    
                                    lazyMount={true}
                                    positioning={{ placement: "top" }}
                                    showArrow
                                    contentProps={{ 
                                        css: { 
                                            "--tooltip-bg": colorMode === "light" ? "colors.cyan.500":"colors.pink.500",
                                            'color': 'white'
                                        }
                                    }}
                                >    
                                    <GridItem 
                                        colSpan={1} 
                                        display={"flex"} 
                                        alignItems={"center"} 
                                        justifyContent={"space-around"}
                                    >
                                        <Icon
                                            as={FaTrash}
                                            cursor="pointer"
                                            size={"md"}
                                            color={"tomato"}
                                            onClick={() => {
                                                handleRemoveFile(index)
                                            }}
                                        />
                                    </GridItem>
                                </Tooltip>
                            </Grid>
                        </Box>
                    </Box>
                )}
            </For>

            <FileUpload.Root alignItems="stretch" maxFiles={1} accept={["image/png", "image/jpeg", "image/gif", "image/webp"]} cursor={"pointer"}>
                <FileUpload.HiddenInput onChange={(files) => handleFileChange(files)}/>
                <FileUpload.Dropzone w={"full"} h={"full"}>
                    <Icon size={"lg"} color={"fg.muted"}>
                        <LuUpload />
                    </Icon>
                    <FileUpload.DropzoneContent>
                        <Box>Drag and drop files here</Box>
                        <Box color="fg.muted">.png, .jpg, .gif, .webp up to 5MB</Box>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
            </FileUpload.Root>

            <Dialog.Root open={isModalOpen} size={"md"}>
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
                                    //aspect={aspect}
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
                                        onClick={handleCancel}
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
        </Flex>
    );
}

export default MultimediaCollector;