import { gql, ApolloError, useLazyQuery } from '@apollo/client';

const CATEGORIES_QUERY = gql`    
    query GetCategories{ 
        getCategories { 
            categoryId 
            name
        }
    }
`;

export const useGetCategory = () => {
    const [getCategories, { data, loading, error }] = useLazyQuery(CATEGORIES_QUERY);

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