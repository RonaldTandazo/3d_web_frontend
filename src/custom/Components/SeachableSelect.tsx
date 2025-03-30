import { Select, Input, Box, Portal } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

const SearchableSelect = ({ disabled=false, placeholder = "Select Options", options, field, multiple = false, defaultValue, ...rest }: any) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [selectedOptions, setSelectedOptions] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if(defaultValue){
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
    }, []);

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
            if(multiple){
                const matchedOptions = options.filter((option: any) => field.value && field.value.includes(option.value));
                setSelectedOptions(matchedOptions.map((option: any) => option.label).join(", "));
            }else{
                setSelectedOptions(options.find((option: any) => field.value && field.value.includes(option.value)).label);
            }
        }
        setIsOpen(false);
        setSearchTerm("")
        setFilteredOptions(options)
    };

    const handleClear = () => {
        setSelectedOptions(null)
    }

    return ( 
        <Select.Root
            multiple={multiple}
            name={field.name}
            value={field.value}
            onValueChange={({ value }) => {
                field.onChange(value);
                field.value = value
                handleClose();
            }}
            defaultValue={defaultValue == null ? (multiple ? []:""):(multiple ? (Array.isArray(defaultValue) ? defaultValue:[defaultValue]):[defaultValue])}
            disabled={disabled}
            lazyMount
        >
            <Select.HiddenSelect {...rest} />
            <Select.Control>
                <Select.Trigger onClick={() => {setIsOpen(true)}} bg={"transparent"} border={"solid thin"} borderColor={"gray.200"} rounded={"sm"}>
                    <Select.ValueText>
                        {selectedOptions ?  selectedOptions:placeholder}
                    </Select.ValueText>
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.ClearTrigger onClick={handleClear}/>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content ref={ref} display={isOpen ? "block":(multiple ? "block":"none")}>
                        <Box p={2}>
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </Box>
                        {filteredOptions.map((option:any) => (
                            <Select.Item 
                                item={option}
                                key={option.value}
                            >
                                {option.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

export default SearchableSelect;