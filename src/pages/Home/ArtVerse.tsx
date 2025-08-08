import { Box, Show } from '@chakra-ui/react';
import ArtVerseGrid from '@/custom/Components/ArtVerseGrid';
import { useEffect, useState } from 'react';
import { useGetArtVerseArtworks } from '@/services/Artwork/ArtworkService';
import LoadingProgress from '@/custom/Components/LoadingProgress';

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

  return (
    <Show
      when={!artVerseArtworksLoading}
      fallback={
        <LoadingProgress />
      }
    >
      <Box>
        <ArtVerseGrid artworks={artworks}/>
      </Box>
    </Show>
  );
};

export default ArtVerse;
