import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { SIGNIN_MUTATION, SIGNUP_MUTATION} from '@/graphql/Authentication/AuthenticationMutations';
import { VALIDATE_USER_ACCESS } from '@/graphql/Authentication/AuthenticationQueries';

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

export const useValidateUserAccess = () => {
    const [validateUserAccess, { loading, data, error }] = useLazyQuery(VALIDATE_USER_ACCESS)
    
    const ValidateUserAccess = async (targetValue: string, module: string) => {
        try {
            await validateUserAccess({
                variables: { targetValue, module },
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        validateUserAccess: ValidateUserAccess,
        data,
        loading,
        error,
    };
};

