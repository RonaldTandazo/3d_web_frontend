import { ApolloError, useLazyQuery, useMutation } from '@apollo/client';
import { REFRESH_TOKEN_MUTATION, REVOKE_TOKEN_MUTATION, SIGNIN_MUTATION, SIGNUP_MUTATION} from '@/graphql/Authentication/AuthenticationMutations';
import { VALIDATE_USER_ACCESS } from '@/graphql/Authentication/AuthenticationQueries';

export const useSignUp = () => {
    const [signUpMutation, { loading, data, error }] = useMutation(SIGNUP_MUTATION);

    const signUp = async (firstName: string, lastName: string, email: string, username: string, password: string) => {
        try {
            const userData = { firstName, lastName, email, username, password };
            await signUpMutation({ 
                variables: { userData }
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

export const useLogin = () => {
    const [loginMutation, { data, loading, error }] = useMutation(SIGNIN_MUTATION);

    const login = async (username: string, password: string, rememberMe: boolean) => {
        try {
            await loginMutation({ 
                variables: { username, password, rememberMe }
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

export const useRefreshToken = () => {
    const [refreshTokenMutation, { data, loading, error }] = useMutation(REFRESH_TOKEN_MUTATION);

    const refreshToken = async (token: string) => {
        try {
            const response = await refreshTokenMutation({ 
                variables: { refreshToken: token } 
            });
            return response;
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        refreshToken, 
        data, 
        loading, 
        error
    };
};

export const useRevokeToken = () => {
    const [revokeTokenMutation, { data, loading, error }] = useMutation(REVOKE_TOKEN_MUTATION);

    const revokeToken = async (token: string) => {
        console.log(token)
        try {
            await revokeTokenMutation({ 
                variables: { refreshToken: token }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        revokeToken,
        data, 
        loading, 
        error
    };
};

export const useValidateUserAccess = () => {
    const [validateUserAccess, { loading, data, error }] = useLazyQuery(VALIDATE_USER_ACCESS, {
        fetchPolicy: 'network-only'
    })
    
    const ValidateUserAccess = async (targetValue: string, module: string) => {
        try {
            await validateUserAccess({
                variables: { targetValue, module }
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

