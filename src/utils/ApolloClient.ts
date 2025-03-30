import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";

const apiUrl = import.meta.env.VITE_API_URL;

const getToken = () => {
  return localStorage.getItem('token');
};

const setAuthorizationLink = setContext((request, previousContext) => {
  if (previousContext && previousContext.requireAuth) {
    const token = getToken();
    return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        }
    };
  }

  return {previousContext}
});

const httpLink = createHttpLink({
  uri: `${apiUrl}/graphql`,
});

export const client = new ApolloClient({
  link: from([setAuthorizationLink, httpLink]),
  cache: new InMemoryCache(),
});