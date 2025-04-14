import { gql } from "@apollo/client";

export const GET_SOCIAL_MEDIA = gql`    
    query GetSocialMedia{ 
        getSocialMedia { 
            socialMediaId 
            name
        }
    }
`;