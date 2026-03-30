import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const { data } = await authAPI.getProfile();
            setUser(data);
        } catch {
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const { data } = await authAPI.login(username, password);
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    const register = async (username: string, email: string, password: string) => {
        const { data } = await authAPI.register(username, email, password);
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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