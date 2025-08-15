import { STORE_USER_SKILLS } from "@/graphql/UserSkills/UserSkillsMutations";
import { GET_SKILLS_DATA, GET_USER_SKILLS } from "@/graphql/UserSkills/UserSkillsQueries";
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";

export const useGetSkillsData = () => {
    const [getSkillsData, { loading, data, error }] = useLazyQuery(GET_SKILLS_DATA)

    const GetSkillsData = async () => {
        try {
            await getSkillsData();
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getSkillsData: GetSkillsData,
        data,
        loading,
        error,
    };
}

export const useGetUserSkills = () => {
    const [getUserSkills, { loading, data, error }] = useLazyQuery(GET_USER_SKILLS)

    const GetUserSkills = async () => {
        try {
            await getUserSkills();
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        getUserSkills: GetUserSkills,
        data,
        loading,
        error,
    };
}

export const useStoreUserSkills= () => {
    const [storeUserSkillsMutation, { data, loading, error }] = useMutation(STORE_USER_SKILLS/*, {
        refetchQueries: [{ query: GET_USER_SKILLS, context: { requireAuth: true } }],
    }*/);

    const storeUserSkills = async (userSkillsData: any) => {
        try {
            await storeUserSkillsMutation({ 
                variables: { userSkillsData }
            });
        } catch (err) {
            if (err instanceof ApolloError) {
                console.error(err.message);
            }
        }
    };

    return {
        storeUserSkills,
        data,
        loading,
        error,
    };
};