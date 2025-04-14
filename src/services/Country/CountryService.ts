import { ApolloError, useLazyQuery } from '@apollo/client';
import { GET_COUNTRIES } from '@/graphql/Country/CountryQueries';

export const useGetCountry = () => {
    const [getCountries, { data, loading, error }] = useLazyQuery(GET_COUNTRIES);

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