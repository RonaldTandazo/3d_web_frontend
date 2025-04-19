import { gql } from '@apollo/client';

export const GET_USER_ARTWORKS = gql`    
    query GetUserArtworks{ 
        getUserArtworks{
            artworkId,
            title,
            thumbnail,
            owner
        }
    }
`;