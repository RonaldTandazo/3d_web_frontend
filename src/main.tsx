import { Provider } from "@/components/ui/provider"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.tsx'; 
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import AppRoutes from './routes/AppRoutes';
import { ApolloProvider } from "@apollo/client";
import { client } from "./utils/ApolloClient.ts";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Provider>
            <AppRoutes />
          </Provider>
        </AuthProvider>
      </ApolloProvider>
    </Router>
  </StrictMode>,
)
