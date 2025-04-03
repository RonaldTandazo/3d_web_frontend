import { gql, ApolloError, useMutation, useLazyQuery } from '@apollo/client';

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

const STORE_USER_NETWORK = gql`
    mutation StoreUserSocialNetwork($storeUserNetwork: SocialMediaStoreInput!) { 
        storeUserSocialNetwork(storeUserNetwork: $storeUserNetwork)
    }
`;

export const useStoreUserSocialNetowrk= () => {
    const [socialNetowrkMutation, { data, loading, error }] = useMutation(STORE_USER_NETWORK);

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

const UPDATE_USER_NETWORK = gql`
    mutation UpdateUserSocialNetwork($updateUserNetwork: UpdateUserNetworkInput!) { 
        updateUserSocialNetwork(updateUserNetwork: $updateUserNetwork)
    }
`;

export const useUpdateUserSocialNetowrk= () => {
    const [updateSocialNetowrkMutation, { data, loading, error }] = useMutation(UPDATE_USER_NETWORK);

    const updateUserNetwork = async (userSocialNetworkId: Number, socialMediaId: number, link: string) => {
        try {
            const updateUserNetwork = { userSocialNetworkId, socialMediaId, link };
            await updateSocialNetowrkMutation({ 
                variables: { updateUserNetwork },
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        updateUserNetwork,
        data,
        loading,
        error,
    };
};

const REMOVE_USER_NETWORK = gql`
    mutation RemoveUserSocialNetwork($userSocialNetworkId: Int!) { 
        removeUserSocialNetwork(userSocialNetworkId: $userSocialNetworkId)
    }
`;

export const useRemoveUserSocialNetowrk= () => {
    const [removeUserNetowrkMutation, { data, loading, error }] = useMutation(REMOVE_USER_NETWORK);

    const removeUserNetwork = async (userSocialNetworkId: number) => {
        try {
            await removeUserNetowrkMutation({ 
                variables: { userSocialNetworkId },
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        removeUserNetwork,
        data,
        loading,
        error,
    };
};