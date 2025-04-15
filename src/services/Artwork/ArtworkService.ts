import { ApolloError, useMutation } from '@apollo/client';
import { STORE_ARTWORK } from '@/graphql/Artwork/ArtworkMutations';

export const useStoreArtwork = () => {
    const [storeArtwork, { loading, data, error }] = useMutation(STORE_ARTWORK);

    const StoreArtwork = async (artworkData: any) => {
        try {
            await storeArtwork({ 
                variables: { artworkData },
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        storeArtwork: StoreArtwork,
        data,
        loading,
        error,
    };
};