import { ApolloError, useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import { STORE_ARTWORK } from '@/graphql/Artwork/ArtworkMutations';
import { GET_USER_ARTWORKS } from '@/graphql/Artwork/ArtworkQueries';

interface GetUserArtworksData {
    getUserArtworks?: any[];
}
  
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

export const useGetUserArtworks = () => {
    const [getUserArtworks, { loading, data, error }] = useLazyQuery(GET_USER_ARTWORKS, {
        fetchPolicy: 'cache-and-network'
    })

    const GetUserArtworks = async () => {
        try {
            await getUserArtworks({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getUserArtworks: GetUserArtworks,
        data,
        loading,
        error,
    };
};