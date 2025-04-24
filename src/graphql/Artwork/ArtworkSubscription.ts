import { gql } from '@apollo/client';

export const NEW_ARTWORK_SUBSCRIPTION = gql`
    subscription {
        newArtwork {
            artwork {
                artworkId,
                title
                thumbnail
                publishingId
                owner
                createdAt
            }
        }
    }
`;