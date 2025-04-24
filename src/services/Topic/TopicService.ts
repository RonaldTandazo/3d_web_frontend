import { ApolloError, useLazyQuery } from '@apollo/client';
import { GET_TOPICS } from '@/graphql/Topic/TopicQueries';

export const useGetTopic = () => {
    const [getTopics, { data, loading, error }] = useLazyQuery(GET_TOPICS);

    const GetTopics = async () => {
        try {
            await getTopics({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getTopics: GetTopics,
        data,
        loading,
        error,
    };
};