import { Box } from '@chakra-ui/react';
import ArtVerseGrid from '@/custom/Components/ArtVerseGrid';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

const ArtVerse = () => {
  const products: Product[] = Array.from({ length: 200 }, (_, index) => ({
    id: index,
    name: `Item ${index}`,
    image: "https://via.placeholder.com/150",
    price: index * 10,
  }));

  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character/")
      .then((response) => response.json())
      .then((data) => setCharacters(data.results))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Box mt={5}>
      <ArtVerseGrid items={characters}/>
    </Box>
  );
};

export default ArtVerse;
