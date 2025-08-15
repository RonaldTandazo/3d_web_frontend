import { useState } from 'react';
import { AspectRatio, Box, Flex, IconButton, Image, Show, Text } from '@chakra-ui/react';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

interface Items {
    type: string,
    url: string,
    caption?: string
}

const aspectRatio = 16 / 9;

const CarouselViewer = ({ items }: { items: Items[]}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slidesCount = items.length;

    const prevSlide = () => {
        setCurrentSlide((s) => (s === 0 ? slidesCount - 1 : s - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((s) => (s === slidesCount - 1 ? 0 : s + 1));
    };

    const carouselProperties = {
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(-${currentSlide * 100}%)`,
        w: `${slidesCount * 100}%`,
        h: 'full'
    };

    return (
        <AspectRatio ratio={aspectRatio} position="relative" width={'full'} height={"auto"}>
            <Box position="relative" width={'full'} height={"full"} overflow="hidden">
                <Flex {...carouselProperties}>
                    {items.map((item, index) => (
                        <Box key={index} flexShrink={0} flexDirection={"column"} w={"full"} h={"full"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <Show
                                when={item.type == 'image'}
                                fallback={
                                    <Show
                                        when={item.type == 'video'}
                                    >
                                        <video
                                            src={item.url}
                                            controls 
                                            style={{ maxHeight: '100%', maxWidth: '100%' }} 
                                        />
                                    </Show>
                                }
                            >
                                <Image
                                    src={item.url}
                                    alt={`Slide ${index + 1}`}
                                    w={"95%"}
                                    h={"96.5%"}
                                    objectFit={"cover"}
                                />
                            </Show>
                            <Show
                                when={item.caption}
                            >
                                <Text
                                    mt={2}
                                    textAlign="center"
                                    color="white"
                                >
                                    {item.caption}
                                </Text>
                            </Show>
                        </Box>
                    ))}
                </Flex>
                <Show
                    when={slidesCount > 1}
                >
                    <IconButton
                        aria-label="Previous slide"
                        onClick={prevSlide}
                        position="absolute"
                        top="50%"
                        left="0"
                        transform="translateY(-50%)"
                        bg="whiteAlpha.500"
                        color="black"
                        _hover={{ bg: 'whiteAlpha.800' }}
                        size="lg"
                    >
                        <MdArrowBackIosNew />
                    </IconButton>
                    <IconButton
                        aria-label="Next slide"
                        onClick={nextSlide}
                        position="absolute"
                        top="50%"
                        right="0"
                        transform="translateY(-50%)"
                        bg="whiteAlpha.500"
                        color="black"
                        _hover={{ bg: 'whiteAlpha.800' }}
                        size="lg"
                    >
                        <MdArrowForwardIos />
                    </IconButton>
                </Show>
            </Box>
        </AspectRatio>
    );
}

export default CarouselViewer;