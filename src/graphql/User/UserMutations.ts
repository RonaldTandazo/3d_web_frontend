import { gql } from "@apollo/client";

export const CHANGE_PASSWORD_MUTATION = gql`
    mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
        changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
    }
`;

export const PROFILE_MUTATION = gql`
    mutation ProfileUpdate($profileUpdate: ProfileInput!) { 
        profileUpdate(profileUpdate: $profileUpdate)
    }
`;