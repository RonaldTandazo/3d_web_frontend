import { gql } from '@apollo/client';

export const GET_SKILLS_DATA = gql`    
    query GetSkillsData{ 
        getSkillsData{
            categories{
                categoryId
                name
            }
            topics{
                topicId
                name
            }
            softwares{
                softwareId
                name
            }
        }
    }
`;

export const GET_USER_SKILLS = gql`    
    query GetUserSkills{ 
        getUserSkills{
            userCategories{
                userId
                categoryId
            }
            userTopics{
                userId
                topicId
            }
            userSoftwares{
                userId
                softwareId
            }
        }
    }
`;