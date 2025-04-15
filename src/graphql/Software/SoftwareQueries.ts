import { gql } from '@apollo/client';

export const GET_SOFTWARE = gql`    
    query GetSoftware{ 
        getSoftware { 
            softwareId 
            name
        }
    }
`;