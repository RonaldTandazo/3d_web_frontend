import { Box } from '@chakra-ui/react';
import ArtVerseGrid from '@/custom/Components/ArtVerseGrid';
import { useEffect, useState } from 'react';
import { useGetArtVerseArtworks } from '@/services/Artwork/ArtworkService';
import LoadignScreen from '@/custom/Templates/LoadingScreen';

const ArtVerse = () => {
  const [artworks, setArtworks] = useState([]);

  const { getArtVerseArtworks, data: artVerseArtworksData, loading: artVerseArtworksLoading } = useGetArtVerseArtworks();

  useEffect(() => {
    getArtVerseArtworks();
  }, []);

  useEffect(() => {
    if (artVerseArtworksData?.getArtVerseArtworks) {
      setArtworks(artVerseArtworksData.getArtVerseArtworks)
    }
  }, [artVerseArtworksData]);

  if(artVerseArtworksLoading) return <LoadignScreen/>

  return (
    <Box>
      <ArtVerseGrid artworks={artworks}/>
    </Box>
  );
};

export default ArtVerse;
