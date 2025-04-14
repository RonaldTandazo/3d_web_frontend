import { gql } from '@apollo/client';

export const GET_PUBLISHING = gql`    
    query GetPublishing{ 
        getPublishing { 
            publishingId 
            name
        }
    }
`;