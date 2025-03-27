import { Box } from '@chakra-ui/react';
import ArtVerseGrid from '@/custom/Components/ArtVerseGrid';
import { useEffect, useState } from 'react';

const ArtVerse = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character/")
      .then((response) => response.json())
      .then((data) => setCharacters(data.results))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Box mx={5}>
      <ArtVerseGrid items={characters}/>
    </Box>
  );
};

export default ArtVerse;
