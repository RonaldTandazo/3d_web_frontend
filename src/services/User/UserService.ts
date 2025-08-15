import { ApolloError, useMutation } from '@apollo/client';
import { STORE_USER_PCITURE, PROFILE_MUTATION, CHANGE_PASSWORD_MUTATION } from '@/graphql/User/UserMutations';

export const useStoreUserPicture = () => {
    const [userPictureMutation, { data, loading, error }] = useMutation(STORE_USER_PCITURE);

    const storeUserPicture = async (picture: string) => {
        try {
            await userPictureMutation({ 
                variables: { picture }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        storeUserPicture,
        data,
        loading,
        error,
    };
};

export const useProfileUpdate= () => {
    const [profileMutation, { data, loading, error }] = useMutation(PROFILE_MUTATION);

    const profileUpdate = async (firstName: string, lastName: string, professionalHeadline: string, summary: string, city: string, countryId: number) => {
        try {
            const profileUpdate = { firstName, lastName, professionalHeadline, summary, city, countryId };
            await profileMutation({ 
                variables: { profileUpdate }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        profileUpdate,
        data,
        loading,
        error,
    };
};

export const useChangePassword = () => {
    const [passwordMutation, { data, loading, error }] = useMutation(CHANGE_PASSWORD_MUTATION);

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            await passwordMutation({ 
                variables: { currentPassword, newPassword }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        changePassword,
        data,
        loading,
        error,
    };
};