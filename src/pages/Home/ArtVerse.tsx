import { Box } from '@chakra-ui/react';
import ArtVerseGrid from '@/custom/Components/ArtVerseGrid';
import { useEffect, useState } from 'react';
import { useGetUserArtworks } from '@/services/Artwork/ArtworkService';
import LoadignScreen from '@/custom/Templates/LoadingScreen';

const ArtVerse = () => {
  const [artworks, setArtworks] = useState([]);

  const { getUserArtworks, data: userArtworksData, loading: userArtworksLoading } = useGetUserArtworks();

  useEffect(() => {
    getUserArtworks();
}, []);

  useEffect(() => {
      if (userArtworksData && userArtworksData.getUserArtworks) {
          setArtworks(userArtworksData.getUserArtworks)
      }
  }, [userArtworksData]);

  if(userArtworksLoading) return <LoadignScreen/>

  return (
    <Box mx={5}>
      <ArtVerseGrid artworks={artworks}/>
    </Box>
  );
};

export default ArtVerse;
