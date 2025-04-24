import { ApolloClient, InMemoryCache, createHttpLink, from, split } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

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

const wsLink = new GraphQLWsLink(createClient({
  url: `${wsUrl}/graphql/ws`,
  connectionParams: () => {
    const token = getToken();
    return {
      authToken: token ? `Bearer ${token}` : "",
    };
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  from([setAuthorizationLink, httpLink]),
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});