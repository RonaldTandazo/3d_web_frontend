import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { STORE_ARTWORK } from '@/graphql/Artwork/ArtworkMutations';
import { GET_ARTWORK_DETAILS, GET_ARTWORK_FORM_DATA, GET_USER_ARTWORKS } from '@/graphql/Artwork/ArtworkQueries';

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

export const useGetArtworkFormData = () => {
    const [getArtworkFormData, { loading, data, error }] = useLazyQuery(GET_ARTWORK_FORM_DATA)

    const GetArtworkFormData = async () => {
        try {
            await getArtworkFormData({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getArtworkFormData: GetArtworkFormData,
        data,
        loading,
        error,
    };
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

export const useGetArtworkDetails = () => {
    const [getArtworkDetails, { loading, data, error }] = useLazyQuery(GET_ARTWORK_DETAILS)

    const GetArtworkDetails = async (artworkId: number) => {
        try {
            await getArtworkDetails({ 
                variables: { artworkId },
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getArtworkDetails: GetArtworkDetails,
        data,
        loading,
        error,
    };
};