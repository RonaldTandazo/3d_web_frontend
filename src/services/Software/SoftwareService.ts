import { ApolloError, useLazyQuery } from '@apollo/client';
import { GET_SOFTWARE } from '@/graphql/Software/SoftwareQueries';

export const useGetSoftware = () => {
    const [getSoftwares, { data, loading, error }] = useLazyQuery(GET_SOFTWARE);

    const GetSoftwares = async () => {
        try {
            await getSoftwares({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getSoftwares: GetSoftwares,
        data,
        loading,
        error,
    };
};