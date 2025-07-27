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
    mutation RegisterUser($userData: RegisterInput!) { 
        registerUser(userData: $userData)
    }
`;

export const VALIDATE_USER_ACCESS = gql`
    query ValidateUserAccess($targetValue: String!, $module: String!) {
        validateUserAccess(targetValue: $targetValue, module: $module) {
            validate
        }
    }
`;