import { ApolloError, useMutation, useLazyQuery } from '@apollo/client';
import { GET_USER_SOCIAL_MEDIA } from '@/graphql/UserSocialNetwork/UserSocialNetworkQueries';
import { REMOVE_USER_NETWORK, STORE_USER_NETWORK, UPDATE_USER_NETWORK } from '@/graphql/UserSocialNetwork/UserSocialNetworkMutations';

export const useGetUserSocialMedia = () => {
    const [getUserSocialMedia, { data, loading, error }] = useLazyQuery(GET_USER_SOCIAL_MEDIA);

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

export const useStoreUserSocialNetowrk= () => {
    const [socialNetowrkMutation, { data, loading, error }] = useMutation(STORE_USER_NETWORK, {
        refetchQueries: [{ query: GET_USER_SOCIAL_MEDIA, context: { requireAuth: true } }],
    });

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

export const useUpdateUserSocialNetowrk= () => {
    const [updateSocialNetowrkMutation, { data, loading, error }] = useMutation(UPDATE_USER_NETWORK, {
        refetchQueries: [{ query: GET_USER_SOCIAL_MEDIA, context: { requireAuth: true } }],
    });

    const updateUserNetwork = async (userSocialNetworkId: number, socialMediaId: number, link: string) => {
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

export const useRemoveUserSocialNetowrk= () => {
    const [removeUserNetowrkMutation, { data, loading, error }] = useMutation(REMOVE_USER_NETWORK, {
        refetchQueries: [{ query: GET_USER_SOCIAL_MEDIA, context: { requireAuth: true } }],
    });

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