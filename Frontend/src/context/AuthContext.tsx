import React, { createContext, useState, useContext, useEffect } from 'react';
import { userAPI } from '../services/api';
import { authAPI } from '../services/api';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    // Vérifier le token en récupérant le profil
                    const { data } = await userAPI.getProfile();
                    setUser(data);
                    setToken(savedToken);
                } catch (error) {
                    console.error('Token invalide:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const { data } = await authAPI.login(username, password);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
    };

    const register = async (username: string, email: string, password: string, consentGiven : boolean) => {
        await authAPI.register(username, email, password, consentGiven);
        // Auto-login après register
        await login(username, password);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const updateUserProfile = (updatedUser: User) => {
        setUser(updatedUser);
    };

    const refreshProfile = async () => {
        try {
            const { data } = await userAPI.getProfile();
            setUser(data);
            return data;
        } catch (error) {
            console.error('Erreur lors du refresh du profil:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontSize: '1.5rem',
                background: '#f9fafb'  // ← Ajoute un background pour voir
            }}>
                Chargement...
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!token,
                updateUserProfile,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};