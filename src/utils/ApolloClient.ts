import { ApolloClient, InMemoryCache, HttpLink, from, split, Observable } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';

const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

let getAccessToken: () => string | null = () => null;
let getRefreshToken: () => string | null = () => null;
let performLogout: () => void = () => {};
let callRefreshToken: (token: string) => Promise<any> = async () => null;
  let isRefreshing = false;
  let refreshTokenPromise: Promise<any> | null = null;

export const setAuthCallbacks = (
  accessTokenCallback: () => string | null,
  refreshTokenCallback: () => string | null,
  refreshTokenProcessCallback: (token: string) => Promise<any>,
  logoutCallback: () => void
) => {
  getAccessToken = accessTokenCallback;
  getRefreshToken = refreshTokenCallback;
  callRefreshToken = refreshTokenProcessCallback;
  performLogout = logoutCallback;
};

const httpLink = new HttpLink({
  uri: `${apiUrl}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  return {
    headers:{
      ...headers,
      authorization: token ? `Bearer ${token}`:""
    }
  }
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('Unauthorized')) {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          performLogout();
          return;
        }

        if (isRefreshing) {
          return new Observable(observer => {
            refreshTokenPromise!.then(() => {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${getAccessToken()}`,
                },
              });
              const subscriber = forward(operation).subscribe(observer);
              return () => subscriber.unsubscribe();
            }).catch(error => {
              observer.error(error);
            });
          });
        }else{
          isRefreshing = true;
  
          refreshTokenPromise = new Promise((resolve, reject) => {
            callRefreshToken(refreshToken)
              .then(({ accessToken }: any) => {
                isRefreshing = false;
                refreshTokenPromise = null;
                resolve(accessToken);
              })
              .catch(refreshError => {
                isRefreshing = false;
                refreshTokenPromise = null;
                performLogout();
                reject(refreshError);
              });
          });
  
          return new Observable(observer => {
            refreshTokenPromise!.then(() => {
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${getAccessToken()}`,
                },
              });
              const subscriber = forward(operation).subscribe(observer);
              return () => subscriber.unsubscribe();
            }).catch(error => {
              observer.error(error);
            });
          });
        }


        // return new Observable(observer => {
        //   callRefreshToken(refreshToken)
        //     .then(({ accessToken }: any) => {
        //       const oldHeaders = operation.getContext().headers;
        //       operation.setContext({
        //         headers: {
        //           ...oldHeaders,
        //           authorization: `Bearer ${accessToken}`,
        //         },
        //       });
        //       const subscriber = forward(operation).subscribe(observer);
        //       return () => subscriber.unsubscribe();
        //     })
        //     .catch(refreshError => {
        //       console.error("Error al refrescar el token (Apollo):", refreshError);
        //       performLogout();
        //       observer.error(refreshError);
        //     });
        // });
      }
    }
  }
});

const wsLink = new GraphQLWsLink(createClient({
  url: `${wsUrl}/graphql/ws`,
  connectionParams: () => {
    const token = getAccessToken();
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
  from([errorLink, authLink, httpLink]),
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});