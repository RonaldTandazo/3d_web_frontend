import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
    mutation RegisterUser($userData: RegisterInput!) { 
        registerUser(userData: $userData)
    }
`;

export const SIGNIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!, $rememberMe: Boolean!) {
        login(username: $username, password: $password, rememberMe: $rememberMe) {
            accessToken
            refreshToken
            tokenType
        }
    }
`;

export const REFRESH_TOKEN_MUTATION = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
            accessToken
            refreshToken
            tokenType
        }
    }
`;

export const REVOKE_TOKEN_MUTATION = gql`
    mutation RevokeToken($refreshToken: String!) {
        revokeToken(refreshToken: $refreshToken)
    }
`;