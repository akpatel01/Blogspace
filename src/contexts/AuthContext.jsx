import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check for existing user session
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    // Verify the token is still valid
                    const currentUser = await authApi.getCurrentUser();
                    if (currentUser) {
                        setUser(currentUser);
                    } else {
                        // If token is invalid, clear the stored user
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authApi.login(credentials);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authApi.signup(userData);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};