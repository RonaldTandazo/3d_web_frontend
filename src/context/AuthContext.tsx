import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLogin, useSignUp } from '../services/Authentication/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';

interface AuthContextType {
    isAuthenticated: boolean;
    signup: (firstName: string, lastName: string, email: string, username: string, password: string) => Promise<void>;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    token: string | null;
    user: { 
        userId: number, 
        firstName: string; 
        lastName: string; 
        username: string; 
        email: string; 
        location: string | null; 
        telephone: string | null; 
        professionalHeadline: string | null; 
        summary: string | null; 
        socialMedia: object | null; 
        since: string | null; 
        countryId: number | null; 
        city: string | null; 
    } | null;
    loading: boolean;
    error: null | ApolloError;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<{ 
        userId: number; 
        firstName: string; 
        lastName: string; 
        username: string; 
        email: string; 
        location: string | null; 
        telephone: string | null; 
        professionalHeadline: string | null; 
        summary: string | null; 
        socialMedia: object | null;
        since: string | null;  
        countryId: number | null; 
        city: string | null; 
    } | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<null | ApolloError>(null);
    const { login: loginUser, data: signInData, error: signInError} = useLogin();
    const { signUp: SignUp, data: singUpData, error: signUpError } = useSignUp();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
    
        if (storedUser && storedToken) {
            if (!isTokenExpired(storedToken)) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (signInData && signInData.login) {
            try {
                const decodedToken = decodeToken(signInData.login.accessToken);

                localStorage.setItem('token', signInData.login.accessToken);
                localStorage.setItem('user', JSON.stringify(decodedToken));

                setToken(signInData.login.accessToken);
                setUser(decodedToken);
                setIsAuthenticated(true);
                navigate('/');
            } catch (error) {
                console.error("Error al decodificar el token:", error);
            }
        }
    }, [signInData]);

    useEffect(() => {
        if (singUpData && singUpData.registerUser) {
            navigate('/signin');
        }
    }, [singUpData]);

    useEffect(() => {
        if (signUpError) {
            setErrorMessage(signUpError);
        }
    }, [signUpError]);

    useEffect(() => {
        if (signInError) {
            setErrorMessage(signInError);
        }
    }, [signInError]);

    const login = async (username: string, password: string) => {
        try {
            clearError()
            setLoading(true);
            await loginUser(username, password);
        } catch (error) {
            console.error("Sign In Error:", error);
        } finally {          
            setLoading(false);
        }
    };

    const signup = async (firstName: string, lastName: string, email: string, username: string, password: string) => {
        try {
            clearError()
            setLoading(true);
            await SignUp(firstName, lastName, email, username, password);
        } catch (error) {
            console.error("Sign Up Error:", error);
        } finally {          
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    const clearError = () => {
        setErrorMessage(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signup, login, logout, token, user, loading, error: errorMessage, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const decodeToken = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        throw new Error("Token inválido");
    }
};

const isTokenExpired = (token: string) => {
    const decoded = decodeToken(token);
    return Date.now() >= decoded.exp * 1000;
};
