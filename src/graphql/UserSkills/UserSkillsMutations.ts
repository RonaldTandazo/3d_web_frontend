import { gql } from "@apollo/client";

export const STORE_USER_SKILLS = gql`
    mutation StoreUserSkills($userSkillsData: UserSkillsInput!) { 
        storeUserSkills(userSkillsData: $userSkillsData) 
    }
`;