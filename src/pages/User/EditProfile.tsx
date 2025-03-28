import { useColorMode } from "@/components/ui/color-mode";
import { Box, Breadcrumb, Icon, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const TickValue = () => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setValue((v) => v + 1);
    }, 1000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <span style={{ fontWeight: "bold", color: "tomato", padding: 4 }}>
      {value}
    </span>
  );
};

const EditProfile = () => {
    const [activeTab, setActiveTab] = useState<string | null>("1")
    const { colorMode } = useColorMode();

    const items = [
        {
            index: "1",
            title: "Personal Information",
            content: "Content 1",
            icon: <ImProfile />,
        },
        {
            index: "2",
            title: "Professional Information",
            content: "Content 2",
            icon: <FaUserTie />,
        },
        {
            index: "3",
            title: "Professional Information",
            content: "Content 3",
            icon: <FaUserTie />,
        },
        {
            index: "4",
            title: "Professional Information",
            content: "Content 4",
            icon: <FaUserTie />,
        }
    ];

    const handleTab = (e) => {
        setActiveTab(e.value)
    }

    return (
        <Box mx={5}
            bg={colorMode === 'light' ? "whiteAlpha.950" : "blackAlpha.500"}
            shadow={"lg"}
            rounded={"lg"}
        >
            <Tabs.Root
                lazyMount
                unmountOnExit
                defaultValue="1"
                orientation="vertical"
                onValueChange={handleTab}
                value={activeTab}
                p={5}
                w={"full"}
            >
                <Tabs.List
                    p={1}
                    gap={3}
                    overflowX="hidden"
                    w={"13vw"}
                >
                    {items.map((item) => (
                        <Tabs.Trigger
                            key={item.index}
                            value={item.index}
                            _selected={{
                                borderLeft: "4px solid",
                                borderLeftColor: colorMode === "light" ? "cyan.500" : "pink.500",
                                backgroundColor: colorMode === "light" ? "cyan.50":"pink.200",
                                color:"black"
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
                                    color={colorMode === "light" ? "cyan.500":"pink.500"}
                                >
                                    {item.icon}
                                </Icon>
                                <Text 
                                    gap={2}
                                    truncate
                                >
                                    {item.title}
                                </Text>
                            </Box>
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
                <Box pos="relative" w={"full"}>
                    {items.map((item) => (
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
                            {item.content} <TickValue />
                        </Tabs.Content>
                    ))}
                </Box>
            </Tabs.Root>
        </Box>
    );
};

export default EditProfile;