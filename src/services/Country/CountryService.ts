import { gql, ApolloError, useQuery } from '@apollo/client';

const COUNTRIES_QUERY = gql`    
    query GetCountries{ 
        getCountries { 
            countryId 
            name
        }
    }
`;

export const useGetCountry = () => {
    const { data, loading, error } = useQuery(COUNTRIES_QUERY);

    return {
        data,
        loading,
        error,
    };
};