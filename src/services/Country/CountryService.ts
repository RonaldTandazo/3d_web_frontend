import { gql, ApolloError, useLazyQuery } from '@apollo/client';

const COUNTRIES_QUERY = gql`    
    query GetCountries{ 
        getCountries { 
            countryId 
            name
        }
    }
`;

export const useGetCountry = () => {
    const [getCountries, { data, loading, error }] = useLazyQuery(COUNTRIES_QUERY);

    const GetCountries = async () => {
        try {
            await getCountries({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getCountries: GetCountries,
        data,
        loading,
        error,
    };
};