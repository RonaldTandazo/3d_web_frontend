import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const apiUrl = import.meta.env.VITE_API_URL;

const httpLink = new HttpLink({
  uri: `${apiUrl}/graphql`,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});