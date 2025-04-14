import { ApolloError, useMutation } from '@apollo/client';
import { SIGNIN_MUTATION, SIGNUP_MUTATION} from '@/graphql/Authentication/AuthenticationMutations';

export const useLogin = () => {
    const [loginMutation, { data, loading, error }] = useMutation(SIGNIN_MUTATION);

    const login = async (username: string, password: string) => {
        try {
            await loginMutation({ 
                variables: { username, password },
                context: { requireAuth: false }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        login,
        data,
        loading,
        error,
    };
};

export const useSignUp = () => {
    const [signUpMutation, { loading, data, error }] = useMutation(SIGNUP_MUTATION);

    const signUp = async (firstName: string, lastName: string, email: string, username: string, password: string) => {
        try {
            const userData = { firstName, lastName, email, username, password };
            await signUpMutation({ 
                variables: { userData },
                context: { requireAuth: false }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        signUp,
        data,
        loading,
        error,
    };
};

