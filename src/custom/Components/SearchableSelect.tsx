import { useColorMode } from "@/components/ui/color-mode";
import { Select, Input, Box, Portal, Show, For } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

interface Option {
    value: number,
    label: string
}

const SearchableSelect = ({ disabled = false, placeholder = "Select Options", options = [], field, multiple = false, defaultValue = undefined, ...rest }: any) => {
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const [selectedOptions, setSelectedOptions] = useState(null);
    const { colorMode } = useColorMode();
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if(filteredOptions.length <= 0){
            setFilteredOptions(options)
        }
        if(defaultValue && options.length > 0){
            if(multiple){
                const matchedOptions = options.filter((option: any) => Array.isArray(defaultValue) ? defaultValue.includes(option.value):[defaultValue].includes(option.value));
                setSelectedOptions(matchedOptions.map((option: any) => option.label).join(", "));
            }else{
                setSelectedOptions(options.find((option: any) => option.value === defaultValue).label);
                field.onChange(defaultValue);
            }

            if(Array.isArray(defaultValue)){
                field.onChange(defaultValue);
            }else{
                field.onChange([defaultValue]);
            }
        }
    }, [options]);

    useEffect(() => {
        setFilteredOptions(options)
        if (options.length > 0 && defaultValue) {
            const valueArray = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
            field.onChange(valueArray);
    
            if (multiple) {
                const matchedOptions = options.filter((option: any) => valueArray.includes(option.value));
                setSelectedOptions(matchedOptions.map((option: any) => option.label).join(", "));
            } else {
                const selectedOption = options.find((option: any) => option.value === defaultValue);
                setSelectedOptions(selectedOption ? selectedOption.label : "");
            }
        }
    }, [options, defaultValue]);

    const handleSearch = (e:any) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredOptions(
            options.filter((option:any) =>
                option.label.toLowerCase().includes(term)
            )
        );
    };

    const handleClose = () => {
        if(field.value && field.value.length > 0){
            const valueArray = field.value;
            if (multiple) {
                const matchedOptions = options.filter((option: any) => valueArray.includes(option.value));
                setSelectedOptions(matchedOptions.map((option: any) => option.label).join(", "));
            } else {
                const selectedOption = options.find((option: any) => valueArray.includes(option.value));
                setSelectedOptions(selectedOption ? selectedOption.label : "");
            }
        }
        setIsOpen(false);
        setSearchTerm("")
        setFilteredOptions(options)
    };

    const handleClear = () => {
        field.onChange(undefined)
        setSelectedOptions(null)
    }

    return ( 
        <Select.Root
            multiple={multiple}
            name={field.name}
            value={field.value}
            onValueChange={({ value }: {value: any}) => {
                if(value && value.length <= 0){
                    value = undefined
                }
                field.onChange(value);
                field.value = value
                handleClose();
            }}
            defaultValue={!defaultValue ? defaultValue:(multiple ? (Array.isArray(defaultValue) ? defaultValue:[defaultValue]):[defaultValue])}
            disabled={disabled}
            lazyMount
            collection={options}
        >
            <Select.HiddenSelect {...rest} />
            <Select.Control>
                <Select.Trigger onClick={() => {setIsOpen(true)}} bg={"transparent"} border={"solid thin"} borderColor={colorMode === "light" ? "gray.200" : "whiteAlpha.300"} rounded={"sm"}>
                    <Select.ValueText>
                        {/* {selectedOptions ?  selectedOptions:placeholder} */}
                        <Show
                            when={selectedOptions}
                            fallback={placeholder}
                        >
                            {selectedOptions}
                        </Show>
                    </Select.ValueText>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.ClearTrigger onClick={handleClear} color={colorMode === "light" ? "cyan.600" : "pink.600"} bg={"transparent"}/>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content ref={ref} display={isOpen ? "block":(multiple ? "block":"none")} position={"relative"}>
                        <Box p={2} position="sticky" top="0" zIndex="sticky" bg={colorMode == 'light' ? "white":"gray.950"}>
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                                color={colorMode === "light" ? "black":"white"}
                            />
                        </Box>
                        <For each={filteredOptions} >
                            {(option) => (
                                <Select.Item 
                                    item={option}
                                    key={option.value}
                                    color={colorMode === "light" ? "black":"white"}
                                    cursor="pointer"
                                >
                                    {option.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            )}
                        </For>
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

export default SearchableSelect;