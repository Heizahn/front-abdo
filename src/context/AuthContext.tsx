import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import authService from '../services/authServices';
import { User } from '../interfaces/Interfaces';

interface AuthContextType {
	user: User | null;
	logout: () => void;
	isAuthenticated: () => boolean;
	loadUser: () => Promise<void>;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	logout: () => {},
	isAuthenticated: () => false,
	loadUser: async () => {},
	loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true); // Iniciar como true es importante

	// Usar useCallback para funciones que se pasan como props
	const loadUser = useCallback(async () => {
		// No hacer nada si no estamos autenticados según el token
		if (!authService.isAuthenticated()) {
			setLoading(false);
			return;
		}

		try {
			const user = await authService.profile();
			setUser(user);
		} catch (error) {
			console.error('Error al cargar el perfil:', error);
			// Si hay un error de autenticación, hacer logout
			authService.logout();
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const logout = useCallback(() => {
		setUser(null);
		authService.logout();
	}, []);

	const isAuthenticated = useCallback(() => {
		return authService.isAuthenticated();
	}, []);

	// Cargar usuario solo una vez al inicio
	useEffect(() => {
		loadUser();
	}, [loadUser]);

	const value = {
		user,
		logout,
		loading,
		isAuthenticated,
		loadUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
