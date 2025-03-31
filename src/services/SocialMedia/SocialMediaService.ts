import { gql, ApolloError, useLazyQuery } from '@apollo/client';

const SOCIAL_MEDIA_QUERY = gql`    
    query GetSocialMedia{ 
        getSocialMedia { 
            socialMediaId 
            name
        }
    }
`;

export const useGetSocialMedia = () => {
    const [getSocialMedia, { data, loading, error }] = useLazyQuery(SOCIAL_MEDIA_QUERY);

    const GetSocialMedia = async () => {
        try {
            await getSocialMedia({ 
                context: { requireAuth: true }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getSocialMedia: GetSocialMedia,
        data,
        loading,
        error,
    };
};