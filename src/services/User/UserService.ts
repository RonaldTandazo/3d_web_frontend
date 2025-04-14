import { ApolloError, useMutation } from '@apollo/client';
import { CHANGE_PASSWORD_MUTATION, PROFILE_MUTATION } from '@/graphql/User/UserMutations';

export const useChangePassword = () => {
    const [passwordMutation, { data, loading, error }] = useMutation(CHANGE_PASSWORD_MUTATION);

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            await passwordMutation({ 
                variables: { currentPassword, newPassword },
                context: { requireAuth: true }
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

export const useProfileUpdate= () => {
    const [profileMutation, { data, loading, error }] = useMutation(PROFILE_MUTATION);

    const profileUpdate = async (firstName: string, lastName: string, professionalHeadline: string, city: string, countryId: number) => {
        try {
            const profileUpdate = { firstName, lastName, professionalHeadline, city, countryId };
            await profileMutation({ 
                variables: { profileUpdate },
                context: { requireAuth: true }
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