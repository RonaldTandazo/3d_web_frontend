import { useColorMode } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";
import { Box, Breadcrumb, Checkbox, Field, Flex, Heading, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ArtStore = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { colorMode } = useColorMode();
    const [title, setTitle] = useState('ArtWork');

    const handleNavigate = () => {
        navigate(`/Profile/${user.username}`)
    }

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
                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"}>
                        <Flex w={"full"} bg={"blackAlpha.500"}>
                            <Heading fontSize={"lg"} my={5} mx={10}>ArtWork Title</Heading>
                        </Flex>
                        <Stack mx={10} mt={5} mb={10}>
                            <Field.Root>
                                <Input size={"lg"} placeholder="Name your ArtWork..." onChange={(e) => setTitle(e.target.value)}/>
                            </Field.Root>
                        </Stack>
                    </Box>
                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"}>
                        <Flex w={"full"} bg={"blackAlpha.500"}>
                            <Heading fontSize={"lg"} my={5} mx={10}>ArtWork Details</Heading>
                        </Flex>
                        <Stack mx={10} mt={5} mb={10} gap={10}>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Description</Field.Label>
                                <Textarea resize="both" size={"lg"} placeholder="Describe your ArtWork..." />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Mature Content</Field.Label>
                                <Checkbox.Root defaultChecked variant={"subtle"}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>Has mature content? (nudes, guns, blood...etc)</Checkbox.Label>
                                </Checkbox.Root>
                            </Field.Root>
                        </Stack>
                    </Box>
                    <Box border={"solid 1px"} w={"full"} borderRadius={"md"}>
                        <Flex w={"full"} bg={"blackAlpha.500"}>
                            <Heading fontSize={"lg"} my={5} mx={10}>ArtWork Categoritzation</Heading>
                        </Flex>
                        <Stack mx={10} mt={5} mb={10} gap={10}>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Description</Field.Label>
                                <Textarea resize="both" size={"lg"} placeholder="Describe your ArtWork..." />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label fontSize={"lg"}>Mature Content</Field.Label>
                                <Checkbox.Root defaultChecked variant={"subtle"}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label>Has mature content? (nudes, guns, blood...etc)</Checkbox.Label>
                                </Checkbox.Root>
                            </Field.Root>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}

export default ArtStore;