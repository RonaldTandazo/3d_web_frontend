import { ApolloError, useLazyQuery } from '@apollo/client';
import { GET_SOCIAL_MEDIA } from '@/graphql/SocialMedia/SocialMediaQueries';

export const useGetSocialMedia = () => {
    const [getSocialMedia, { data, loading, error }] = useLazyQuery(GET_SOCIAL_MEDIA);

    const GetSocialMedia = async () => {
        try {
            await getSocialMedia();
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