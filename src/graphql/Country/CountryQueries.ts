import { gql } from '@apollo/client';

export const GET_COUNTRIES = gql`    
    query GetCountries{ 
        getCountries { 
            countryId 
            name
        }
    }
`;