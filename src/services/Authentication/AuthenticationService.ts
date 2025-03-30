import { gql, ApolloError, useMutation } from '@apollo/client';

const SIGNIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            accessToken
            tokenType
        }
    }
`;

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

const SIGNUP_MUTATION = gql`
    mutation registerUser($userData: RegisterInput!) { 
        registerUser(userData: $userData)
    }
`;

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

