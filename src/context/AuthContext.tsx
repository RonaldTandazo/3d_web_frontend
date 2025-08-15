import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useLogin, useSignUp, useRefreshToken, useRevokeToken } from '../services/Authentication/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import { ApolloError } from '@apollo/client';
import { set } from 'react-hook-form';
import { setAuthCallbacks } from '@/utils/ApolloClient';

interface User {
    userId: number
    firstName: string
    lastName: string
    username: string 
    email: string
    location: string | null 
    telephone: string | null
    professionalHeadline: string | null 
    summary: string | null 
    since: string | null
    countryId: number | null 
    city: string | null
    avatar: string | null
}

interface AuthContextType {
    isAuthenticated: boolean;
    signup: (firstName: string, lastName: string, email: string, username: string, password: string) => Promise<void>;
    login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => void;
    updateUser: (newUser: User) => void;
    token: string | null;
    user: User | null;
    loading: boolean;
    error: null | ApolloError;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<null | ApolloError>(null);
    const { signUp: SignUp, data: singUpData, error: signUpError } = useSignUp();
    const { login: loginUser, data: signInData, error: signInError} = useLogin();
    const { refreshToken: refreshTokenProcess } = useRefreshToken();
    const { revokeToken: RevokeToken, data: revokeTokenData } = useRevokeToken();
    const didMountRef = useRef(false);
    const navigate = useNavigate();

    const getAccessTokenRef = useRef(() => accessToken);
    const getRefreshTokenRef = useRef(() => refreshToken);
    const performLogoutRef = useRef(() => logout());

    const callRefreshTokenRef = useRef(async (token: string) => {
        try {
            const { data } = await refreshTokenProcess(token);
            if (data && data.refreshToken) {
                setAccessToken(data.refreshToken.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken.refreshToken);
                setRefreshToken(data.refreshToken.refreshToken);
                return data.refreshToken;
            }
            return null;
        } catch (err) {
            console.error("Error al refrescar el token:", err);
            throw err;
        }
    });

    const logout = async (token = refreshToken) => {
        if(token){
            try {
                setLoading(true)
                navigate('/signin');
                
                await RevokeToken(token);
            } catch (error) {
                console.error("Sign In Error:", error);
            }finally{
                localStorage.removeItem("user");
                localStorage.removeItem("refreshToken");
                
                setUser(null);
                setAccessToken(null);
                setRefreshToken(null);
                setIsAuthenticated(false);
            }
        }
    };

    useEffect(() => {
        if(revokeTokenData?.revokeToken){
            setLoading(false)
        }
    }, [revokeTokenData])

    useEffect(() => {
        getAccessTokenRef.current = () => accessToken;
        getRefreshTokenRef.current = () => refreshToken;
        performLogoutRef.current = () => logout();

        setAuthCallbacks(
            getAccessTokenRef.current,
            getRefreshTokenRef.current,
            callRefreshTokenRef.current,
            performLogoutRef.current
        );
    }, [accessToken, refreshToken, logout, callRefreshTokenRef]);

    useEffect(() => {
        if (didMountRef.current) {
            return;
        }
        didMountRef.current = true;

        getAccessTokenRef.current = () => accessToken;
        getRefreshTokenRef.current = () => refreshToken;
        performLogoutRef.current = () => logout();

        const storedUser = localStorage.getItem("user");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        if (storedUser && storedRefreshToken) {
            const tryRefreshOnLoad = async () => {
                try {
                    if (!hasRememberMe(storedRefreshToken) || isTokenExpired(storedRefreshToken)) {
                        logout(storedRefreshToken);
                    } else {
                        const newTokens = await callRefreshTokenRef.current(storedRefreshToken);
                        if (newTokens) {
                            setAccessToken(newTokens.accessToken);
                            setUser(JSON.parse(storedUser));
                            setIsAuthenticated(true);
                            setLoading(false)
                        } else {
                            logout(storedRefreshToken);
                        }
                    }
                } catch (err) {
                    logout(storedRefreshToken);
                }
            };
            tryRefreshOnLoad();
        } else {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        if (signInData && signInData.login) {
            try {
                const decodedToken = decodeToken(signInData.login.accessToken);

                localStorage.setItem('refreshToken', signInData.login.refreshToken);
                localStorage.setItem('user', JSON.stringify(decodedToken));
                setRefreshToken(signInData.login.refreshToken);
                setAccessToken(signInData.login.accessToken);

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
            setIsAuthenticated(true)
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

    const login = async (username: string, password: string, rememberMe: boolean) => {
        try {
            clearError()
            setLoading(true);
            await loginUser(username, password, rememberMe);
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

    const updateUser = (newUser: User) => {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const clearError = () => {
        setErrorMessage(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signup, login, logout, token: accessToken, user, loading, error: errorMessage, clearError, updateUser }}>
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

const hasRememberMe = (token: string) => {
    const decoded = decodeToken(token);
    if(decoded.rememberMe){
        return true;
    }

    return false;
};
