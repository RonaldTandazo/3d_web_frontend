import { gql, ApolloError, useMutation, useLazyQuery } from '@apollo/client';

const USER_NETWORK_STORE = gql`
    mutation StoreUserSocialNetwork($storeUserNetwork: SocialMediaStoreInput!) { 
        storeUserSocialNetwork(storeUserNetwork: $storeUserNetwork)
    }
`;

export const useStoreUserSocialNetowrk= () => {
    const [socialNetowrkMutation, { data, loading, error }] = useMutation(USER_NETWORK_STORE);

    const storeUserNetwork = async (socialMediaId: number, link: string) => {
        try {
            const storeUserNetwork = { socialMediaId, link };
            await socialNetowrkMutation({ 
                variables: { storeUserNetwork },
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        storeUserNetwork,
        data,
        loading,
        error,
    };
};

const USER_SOCIAL_MEDIA = gql`
    query GetUserSocialMedia{ 
        getUserSocialMedia { 
            userSocialNetworkId 
            socialMediaId 
            network
            link
        }
    }
`;

export const useGetUserSocialMedia = () => {
    const [getUserSocialMedia, { data, loading, error }] = useLazyQuery(USER_SOCIAL_MEDIA);

    const GetUserSocialMedia = async () => {
        try {
            await getUserSocialMedia({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getUserSocialMedia: GetUserSocialMedia,
        data,
        loading,
        error,
    };
};