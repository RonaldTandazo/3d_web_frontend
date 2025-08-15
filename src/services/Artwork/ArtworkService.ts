import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { STORE_ARTWORK } from '@/graphql/Artwork/ArtworkMutations';
import { GET_ARTVERSE_ARTWORKS, GET_USER_ARTWORKS, GET_ARTWORK_DETAILS, GET_ARTWORK_FORM_DATA } from '@/graphql/Artwork/ArtworkQueries';

export const useGetArtVerseArtworks = () => {
    const [getArtVerseArtworks, { loading, data, error }] = useLazyQuery(GET_ARTVERSE_ARTWORKS, {
        fetchPolicy: 'cache-and-network'
    })

    const GetArtVerseArtworks = async () => {
        try {
            await getArtVerseArtworks();
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getArtVerseArtworks: GetArtVerseArtworks,
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
            await getUserArtworks();
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
            await getArtworkFormData();
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
                variables: { artworkData }
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
                variables: { artworkId }
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