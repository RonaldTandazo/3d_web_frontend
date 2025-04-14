import { gql } from "@apollo/client";


export const GET_USER_SOCIAL_MEDIA = gql`
    query GetUserSocialMedia{ 
        getUserSocialMedia { 
            userSocialNetworkId 
            socialMediaId 
            network
            link
        }
    }
`;