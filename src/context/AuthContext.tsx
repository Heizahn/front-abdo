import React, { useState, useEffect, useContext } from "react";
import authService from "../services/authServices";
import { User } from "../interfaces/Interfaces";

const AuthContext = React.createContext({
    user: { id: "", name: "", role: 0 } as User | null,
    logout: () => {},
    isAuthenticated: () => authService.isAuthenticated(),
    loadUser: () => {},
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const loadUser = async () => {
        try {
            const user = await authService.profile();
            setUser(user);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar el perfil:", error);
            setLoading(false);
        }
    };
    useEffect(() => {
        loadUser();
    }, []);

    const logout = () => {
        setUser(null);
        authService.logout();
    };

    const isAuthenticated = () => {
        return authService.isAuthenticated();
    };

    return (
        <AuthContext.Provider
            value={{ user, logout, loading, isAuthenticated, loadUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
