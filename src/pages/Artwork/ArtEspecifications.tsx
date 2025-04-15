import ArtVerseGrid from '@/custom/Components/ArtVerseGrid';
import DecorativeBox from '@/custom/Templates/DecorativeBox';
import Empty from '@/custom/Templates/Empty';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ArtEspecifications = () => {
    const location = useLocation();
    const { item } = location.state || {};
    const [characters, setCharacters] = useState([]);

    if (!item) {
        useEffect(() => {
            fetch("https://rickandmortyapi.com/api/character/")
                .then((response) => response.json())
                .then((data) => setCharacters(data.results))
                .catch((error) => console.error("Error fetching data:", error));
        }, []);

        return (
            <>
                <Empty />
                <ArtVerseGrid items={characters} />
            </>
        );
    }

    return (
        <Box mb={5}>
            <Grid
                templateRows="repeat(4, auto)"
                templateColumns="repeat(5, 1fr)"
                gap={3}
                height="auto"
                bg={"blue"}
            >
                <GridItem 
                    colSpan={4} 
                    rowSpan={4} 
                >
                    <DecorativeBox name={"Images"} image={null} />
                </GridItem>

                <GridItem 
                    colSpan={1}
                    position="sticky" 
                    top="85px"
                    h={"auto"}
                >
                    <DecorativeBox name={"Information"} image={null} />
                </GridItem>
                <GridItem 
                    colSpan={1} 
                    position="sticky" 
                    top="85px"
                >
                    <DecorativeBox name={"comments"} image={null} />
                </GridItem>
                <GridItem 
                    colSpan={1} 
                    position="sticky" 
                    top="85px"
                >
                    <DecorativeBox name={"Comments"} image={null} />
                </GridItem>
                <GridItem 
                    colSpan={1} 
                    position="sticky" 
                    top="85px"
                >
                    <DecorativeBox name={"More"} image={null} />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default ArtEspecifications;
