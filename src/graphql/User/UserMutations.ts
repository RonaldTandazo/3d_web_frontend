import { gql } from "@apollo/client";

export const STORE_USER_PCITURE = gql`
    mutation StoreUserPicture($picture: String!) { 
        storeUserPicture(picture: $picture){
            label
            value
        }
    }
`;

export const PROFILE_MUTATION = gql`
    mutation ProfileUpdate($profileUpdate: ProfileInput!) { 
        profileUpdate(profileUpdate: $profileUpdate)
    }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
    mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
        changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
    }
`;