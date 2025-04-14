import { gql } from '@apollo/client';

export const SIGNIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            accessToken
            tokenType
        }
    }
`;

export const SIGNUP_MUTATION = gql`
    mutation registerUser($userData: RegisterInput!) { 
        registerUser(userData: $userData)
    }
`;