import { useColorMode } from '@/components/ui/color-mode';
import { Tooltip } from '@/components/ui/tooltip';
import { getCroppedImg } from '@/utils/CanvasCrop';
import { Box, Button, Dialog, FileUpload, Flex, For, Grid, GridItem, Icon, Image, Portal, Show } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FaCheckCircle, FaTrash } from 'react-icons/fa';
import { FaCropSimple } from 'react-icons/fa6';
import { LuUpload } from 'react-icons/lu';
import { MdCancel } from 'react-icons/md';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop'

type FileInterface = {
    originalFile: string;
    crop: string;
};

const MultimediaCollector = ({ type, onUpdate, files, onError }: any) => {
    const [crop, setCrop] = useState<Crop>()
    const [imgURL, setImgURL] = useState<string | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
    const [aspect, setAspect] = useState<number | undefined>(1 / 1)
    const [scale, setScale] = useState<number>(1)
    const [rotate, setRotate] = useState<number>(0)
    const imgRef = useRef<HTMLImageElement>(null)
    const { colorMode } = useColorMode();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recropIndex, setRecropIndex] = useState<number | null>(null);
    const [allowTypes, setAllowTypes] = useState<string[]>([]);
    const [allowFileSize, setAllowFileSize] = useState<number | undefined>(undefined);
    const [maxSize, setMaxSize] = useState<string | undefined>(undefined);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return null;

        if (!allowTypes.includes(file.type)) {
            const allowedFileTypes = allowTypes.map(type => type.split('/')[1].toUpperCase()).join(', ');
            const errorMessage = `Invalid file type. Only ${allowedFileTypes} are allowed.`;
            onError(errorMessage);
            return;
        }

        if (allowFileSize && file.size > allowFileSize) {
            const errorMessage = 'File size exceeds the limit of 5MB.';
            onError(errorMessage);
            return;
        }
        
        onError(undefined);
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
                //setFiles(newFiles);
                setRecropIndex(null);

                onUpdate(type, newFiles);
            } else {
                if(imgURL){
                    const newFileObject = {
                        originalFile: imgURL,
                        crop: croppedImageUrl,
                    };
                    //setFiles([...files, newFileObject]);
                    onUpdate(type, [...files, newFileObject]);
                }
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
        const newFiles = files.filter((_: FileInterface, index: any) => index !== indexToRemove);
        //setFiles(newFiles);
        onUpdate(type, newFiles);
    }

    const handleCrop = (index: number) => {
        const fileToRecrop = files[index];
        setImgURL(fileToRecrop.originalFile);
        setIsModalOpen(true);
        setRecropIndex(index);
        setCrop(undefined);
        setCompletedCrop(null);
    }

    useEffect(() => {
        if(type == 'images'){
            setAllowTypes(["image/png", "image/jpeg", "image/gif", "image/webp"]);
            setAllowFileSize(100 * 1024 * 1024)
            setMaxSize('100MB')
        }else if(type == 'videos'){
            setAllowTypes(["video/mp4", "video/webm", "video/mpeg"]);
            setAllowFileSize(2 * 1024 * 1024 * 1024)
            setMaxSize('2GB')
        }
    }, [type])

    const fileUploadMessage = () => {
        const allowedExtensions = allowTypes.map(type => `.${type.split('/')[1]}`).join(', ');
        const message = `${allowedExtensions} up to ${maxSize}`;

        return message;
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
                        borderRadius={"md"}
                    >
                        <Box
                            cursor={"pointer"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            bg={colorMode === 'light' ? 'cyan.600' : 'pink.600'}
                            color={'whiteAlpha.950'}
                        >
                            <Show
                                when={type == 'images'}
                            >
                                <Image
                                    src={file.crop} 
                                    alt="File Preview"
                                    //objectFit="cover" 
                                    cursor="pointer"
                                />
                            </Show>
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
                                            "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
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
                                            "--tooltip-bg": colorMode === "light" ? "colors.cyan.600":"colors.pink.600",
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

            <FileUpload.Root alignItems="stretch" maxFiles={1} accept={allowTypes} cursor={"pointer"}>
                <FileUpload.HiddenInput onChange={(files) => handleFileChange(files)}/>
                <FileUpload.Dropzone w={"full"} h={"full"}>
                    <Icon size={"lg"} color={"fg.muted"}>
                        <LuUpload />
                    </Icon>
                    <FileUpload.DropzoneContent>
                        <Box>Drag and drop files here</Box>
                        <Box color="fg.muted">{fileUploadMessage()}</Box>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
            </FileUpload.Root>

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
                                        bg={colorMode === "light" ? "cyan.600":"pink.600"}
                                        color={"whiteAlpha.950"}
                                        onClick={handleCancel}
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
        </Flex>
    );
}

export default MultimediaCollector;