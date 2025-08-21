import { useColorMode } from "@/components/ui/color-mode";
import { Select, Input, Box, Portal, For } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

type Option = {
    value: number,
    label: string,
}

const SearchableInput = ({ disabled = false, placeholder = "Select Options", options, onSelect, ...rest }: any) => {
    const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
    const { colorMode } = useColorMode();
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if(filteredOptions.length <= 0){
            setFilteredOptions(options)
        }
    }, [options]);

    const handleSearch = (term:string) => {
        setSearchTerm(term);
        setFilteredOptions(
            options.filter((option:any) =>
                option.label.toLowerCase().includes(term)
            )
        );
    };

    const handleOnSelect = (option:any) => {
        handleSearch("")
        onSelect(option, "add")
    }

    return ( 
        <Select.Root>
            <Select.HiddenSelect {...rest} />
            <Select.Control>
                <Select.Trigger onClick={() => {setIsOpen(true)}} bg={"transparent"} border={"solid thin"} borderColor={colorMode === "light" ? "gray.200" : "whiteAlpha.300"} rounded={"sm"}>
                    <Select.ValueText>
                        {placeholder}
                    </Select.ValueText>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content ref={ref} display={isOpen ? "block":"none"}>
                        <Box p={2}>
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                color={colorMode === "light" ? "black":"white"}
                            />
                        </Box>
                        <For each={filteredOptions}>
                            {(option) =>(
                                <Select.Item 
                                    item={option}
                                    key={option.value}
                                    color={colorMode === "light" ? "black":"white"}
                                    cursor="pointer"
                                    onClick={() => handleOnSelect(option)}
                                >
                                    {option.label}
                                </Select.Item>
                            )}
                        </For>
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

export default SearchableInput;