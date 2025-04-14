import { ApolloError, useLazyQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/graphql/Category/CategoryQueries';

export const useGetCategory = () => {
    const [getCategories, { data, loading, error }] = useLazyQuery(GET_CATEGORIES);

    const GetCountries = async () => {
        try {
            await getCategories({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getCategories: GetCountries,
        data,
        loading,
        error,
    };
};