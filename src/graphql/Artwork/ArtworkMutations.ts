import { gql } from '@apollo/client';

export const STORE_ARTWORK = gql`
    mutation ($artworkData: StoreArtworkInput!) { 
        storeArtwork(artworkData: $artworkData){
            artworkId,
            title,
            thumbnail
        }
    }
`;