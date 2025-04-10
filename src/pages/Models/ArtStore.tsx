import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import LoadingProgress from "@/custom/Components/LoadingProgress";
import { useGetCategory } from "@/services/Category/CategoryService";
import { Box, Breadcrumb, Checkbox, CheckboxCard, Field, Flex, For, Heading, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ArtStore = () => {
    const { getCategories, data: categoriesData, loading: categoriesLoading } = useGetCategory();
    
    const navigate = useNavigate();
    const { user } = useAuth();
    const { colorMode } = useColorMode();
    const [title, setTitle] = useState('ArtWork');
    const [categories, setCategories] = useState([]);

    const handleNavigate = () => {
        navigate(`/Profile/${user.username}`)
    }

    useEffect(() => {
            getCategories();
    }, []);

    useEffect(() => {
        if (categories.length <= 0 && categoriesData && categoriesData.getCategories) {
            const formattedCategories = categoriesData.getCategories.map((category: any) => ({
                value: category.categoryId,
                label: category.name,
            }));
            console.log(formattedCategories)
            setCategories(formattedCategories);
        }
    }, [categoriesData]);

    if(categoriesLoading) return <LoadingProgress />

    return (
        <Box w={"auto"} h={"auto"} mx={5}>
            <Box mt={5}>
                <Breadcrumb.Root size={"lg"}>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link onClick={handleNavigate} color={colorMode === "light" ? "cyan.500":"pink.500"}>Profile</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.CurrentLink>New ArtWork</Breadcrumb.CurrentLink>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
                <Heading my={10} size={"4xl"}>{title}</Heading>
                <Stack mt={10} gap={10} h={"auto"}>
                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.200":"whiteAlpha.300"}>
                        <Box w={"full"} bg={colorMode === "light" ? "cyan.200":"blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                            <Heading fontSize={"lg"}>ArtWork Title</Heading>
                        </Box>
                        <Stack mx={10} mt={5} mb={10}>
                            <Field.Root>
                                <Input size={"lg"} placeholder="Name your ArtWork..." onChange={(e) => setTitle(e.target.value)}/>
                            </Field.Root>
                        </Stack>
                    </Box>
                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.200":"whiteAlpha.300"}>
                        <Box w={"full"} bg={colorMode === "light" ? "cyan.200":"blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                            <Heading fontSize={"lg"}>ArtWork Details</Heading>
                        </Box>
                        <Stack mx={10} mt={5} mb={10} gap={10}>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Description</Field.Label>
                                <Textarea resize="both" size={"lg"} placeholder="Describe your ArtWork..." />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Mature Content</Field.Label>
                                <Checkbox.Root variant={"solid"} colorPalette={colorMode === "light" ? "cyan":"pink"}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>Has mature content? (nudes, weapons, blood, drugs...etc)</Checkbox.Label>
                                </Checkbox.Root>
                            </Field.Root>
                        </Stack>
                    </Box>
                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"} borderColor={colorMode === "light" ? "cyan.200":"whiteAlpha.300"}>
                        <Box w={"full"} bg={colorMode === "light" ? "cyan.200":"blackAlpha.500"} py={5} px={10} borderTopRadius={"sm"}>
                            <Heading fontSize={"lg"}>ArtWork Categoritzation</Heading>
                        </Box>
                        <Stack mx={10} mt={5} mb={10} gap={10}>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Categories</Field.Label>
                                <Box py={5} w={"full"}>
                                    <Flex 
                                        gap={4}
                                        display="grid" 
                                        gridTemplateColumns="repeat(6, 1fr)"
                                        gridAutoRows="auto"
                                    >
                                        <For each={categories}>
                                            {(item) => (
                                                <CheckboxCard.Root
                                                    defaultChecked
                                                    key={item.value}
                                                    variant={"outline"}
                                                    colorPalette={colorMode === "light" ? "cyan":"pink"}
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
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Software Used</Field.Label>
                                <Textarea resize="both" size={"lg"} placeholder="Describe your ArtWork..." />
                            </Field.Root>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}

export default ArtStore;