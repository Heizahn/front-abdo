import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import authService from '../services/authServices';
import { User } from '../interfaces/Interfaces';
import { queryClient } from '../query-client';

// Definimos las constantes para los roles
export const ROLES = {
	SUPERADMIN: 0,
	ACCOUNTANT: 1,
	PAYMENT_USER: 2,
	PROVIDER: 3,
} as const;

// Definimos el tipo para los roles
export type RoleType = (typeof ROLES)[keyof typeof ROLES];

interface AuthContextType {
	user: User | null;
	logout: () => void;
	isAuthenticated: () => boolean;
	loadUser: () => Promise<void>;
	loading: boolean;
	hasRole: (role: RoleType) => boolean;
	hasAccess: (requiredRoles?: RoleType[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	logout: () => {},
	isAuthenticated: () => false,
	loadUser: async () => {},
	loading: true,
	hasRole: () => false,
	hasAccess: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true); // Iniciar como true es importante

	// Usar useCallback para funciones que se pasan como props
	const loadUser = useCallback(async () => {
		// No hacer nada si no estamos autenticados según el token
		if (!authService.isAuthenticated()) {
			setLoading(false);
			setUser(null); // Asegurarse de que user sea null cuando no estamos autenticados
			return;
		}

		try {
			setLoading(true); // Indicar que estamos cargando
			const userData = await authService.profile();
			setUser(userData);
			return userData; // Devolver los datos del usuario por si se necesitan
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
		// Limpiar toda la caché de TanStack Query
		queryClient.removeQueries();
		// No redirigir aquí, esto lo maneja el botón de logout
	}, []);

	const isAuthenticated = useCallback(() => {
		return authService.isAuthenticated();
	}, []);

	// Nueva función para verificar si el usuario tiene un rol específico
	const hasRole = useCallback(
		(role: RoleType): boolean => {
			return user !== null && user.role === role;
		},
		[user],
	);

	// Nueva función para verificar si el usuario tiene acceso según los roles requeridos
	const hasAccess = useCallback(
		(requiredRoles: RoleType[] = []): boolean => {
			// Si no hay roles requeridos, cualquier usuario autenticado tiene acceso
			if (requiredRoles.length === 0) return isAuthenticated();

			// Verificar si el usuario tiene alguno de los roles requeridos
			return user !== null && requiredRoles.includes(user.role as RoleType);
		},
		[user, isAuthenticated],
	);

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
		hasRole,
		hasAccess,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
