import { ApolloError, useLazyQuery } from '@apollo/client';
import { GET_PUBLISHING } from '@/graphql/Publishing/PublishingQueries';

export const useGetPublishing = () => {
    const [getPublishing, { data, loading, error }] = useLazyQuery(GET_PUBLISHING);

    const GetPublishing = async () => {
        try {
            await getPublishing({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getPublishing: GetPublishing,
        data,
        loading,
        error,
    };
};