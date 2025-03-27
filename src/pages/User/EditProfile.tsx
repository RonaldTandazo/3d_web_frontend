import { useColorMode } from "@/components/ui/color-mode";
import { Box, Tabs, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
    const colorMode = useColorMode();

    const items = [
        {
            index: "1",
            title: "Tab 1",
            content: "Content 1",
        },
        {
            index: "2",
            title: "Tab 2",
            content: "Content 2",
        },
        {
            index: "3",
            title: "Tab 3",
            content: "Content 3",
        }
    ];

    const handleTab = (e) => {
        setActiveTab(e.value)
    }

    return (
        <Box mx={5}>
            <Tabs.Root
                lazyMount
                unmountOnExit
                defaultValue="1"
                width="full"
                orientation="vertical"
                onValueChange={handleTab}
                value={activeTab}
            >
                <Tabs.List
                    rounded="l3"
                    p="1"
                    gap={3}
                    maxWidth="200px"
                    overflowX="hidden"
                    bg="bg.muted"
                >
                    {items.map((item) => (
                        <Tabs.Trigger
                            key={item.index}
                            value={item.index}
                            textOverflow={"ellipsis"}
                            position={"relative"}
                            overflow={"hidden"}
                            whiteSpace={"nowrap"}
                        >
                            <Text as="span" display={"inline-block"}>
                                {item.title}
                            </Text>
                        </Tabs.Trigger>
                    ))}
                    <Tabs.Indicator rounded="l2" />
                </Tabs.List>
                <Box pos="relative" width="full">
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