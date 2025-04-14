import { gql } from "@apollo/client";

export const STORE_USER_NETWORK = gql`
    mutation StoreUserSocialNetwork($storeUserNetwork: SocialMediaStoreInput!) { 
        storeUserSocialNetwork(storeUserNetwork: $storeUserNetwork)
    }
`;

export const UPDATE_USER_NETWORK = gql`
    mutation UpdateUserSocialNetwork($updateUserNetwork: UpdateUserNetworkInput!) { 
        updateUserSocialNetwork(updateUserNetwork: $updateUserNetwork)
    }
`;


export const REMOVE_USER_NETWORK = gql`
    mutation RemoveUserSocialNetwork($userSocialNetworkId: Int!) { 
        removeUserSocialNetwork(userSocialNetworkId: $userSocialNetworkId)
    }
`;