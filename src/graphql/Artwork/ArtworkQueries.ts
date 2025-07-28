import { gql } from '@apollo/client';

export const GET_ARTVERSE_ARTWORKS = gql`    
    query GetArtVerseArtworks{ 
        getArtVerseArtworks{
            artworkId
            title
            thumbnail
            publishingId
            owner
            avatar
            createdAt
        }
    }
`;

export const GET_USER_ARTWORKS = gql`    
    query GetUserArtworks{ 
        getUserArtworks{
            artworkId
            title
            thumbnail
            publishingId
            owner
            createdAt
        }
    }
`;

export const GET_ARTWORK_FORM_DATA = gql`    
    query GetArtworkFormData{ 
        getArtworkFormData{
            publishing{
                publishingId
                name
            }
            categories{
                categoryId
                name
            }
            topics{
                topicId
                name
            }
            softwares{
                softwareId
                name
            }
        }
    }
`;

export const GET_ARTWORK_DETAILS = gql`    
    query GetArtworkDetails($artworkId: Int!){ 
        getArtworkDetails(artworkId: $artworkId){
            artworkId
            title
            description
            matureContent
            categories
            topics {
                value
                label
            }
            softwares {
                value
                label
            }
            publishingId
            thumbnail
            createdAt
        }
    }
`;