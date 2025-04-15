import { ApolloError, useLazyQuery } from '@apollo/client';
import { GET_SOFTWARE } from '@/graphql/Software/SoftwareQueries';

export const useGetSoftware = () => {
    const [getSoftware, { data, loading, error }] = useLazyQuery(GET_SOFTWARE);

    const GetSoftware = async () => {
        try {
            await getSoftware({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getSoftware: GetSoftware,
        data,
        loading,
        error,
    };
};