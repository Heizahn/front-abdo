import axios from 'axios';
import { HOST_API } from '../config/env';

// Variable para controlar si los interceptores ya fueron configurados
let interceptorsConfigured = false;

const authService = {
	login: async (email: string, password: string) => {
		try {
			const response = await axios.post(`${HOST_API}/users/login`, {
				email,
				password,
			});

			if (response.data && response.data.token) {
				// Guardar el token
				localStorage.setItem('token', response.data.token);

				// Configurar el token en los headers de axios INMEDIATAMENTE
				axios.defaults.headers.common[
					'Authorization'
				] = `Bearer ${response.data.token}`;

				// Configurar interceptores solo si no se han configurado previamente
				if (!interceptorsConfigured) {
					authService.setupAxiosInterceptors();
				}

				return response.data;
			}

			return null;
		} catch (error) {
			console.error('Error en login:', error);
			throw error;
		}
	},

	profile: async () => {
		try {
			// Asegurarse de que estamos autenticados antes de hacer la solicitud
			if (!authService.isAuthenticated()) {
				throw new Error('No hay token de autenticación');
			}

			// Establecer el token nuevamente antes de la solicitud para asegurarnos
			const token = authService.getToken();
			if (token) {
				axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			}

			const response = await axios.get(`${HOST_API}/whoAmI`);
			return response.data;
		} catch (error) {
			console.error('Error al obtener el perfil:', error);
			throw error;
		}
	},

	logout: () => {
		localStorage.removeItem('token');
		delete axios.defaults.headers.common['Authorization'];
	},

	isAuthenticated: () => {
		return !!localStorage.getItem('token');
	},

	getToken: () => {
		return localStorage.getItem('token');
	},

	setupAxiosInterceptors: () => {
		// Evitar configurar los interceptores más de una vez
		if (interceptorsConfigured) return;

		// Interceptor para manejar errores de autenticación
		axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response && error.response.status === 401) {
					// Si recibimos un 401, limpiamos el token y redirigimos al login
					authService.logout();

					// Solo redirigir si no estamos ya en la página de login
					if (!window.location.pathname.includes('/login')) {
						window.location.href = '/login';
					}
				}
				return Promise.reject(error);
			},
		);

		// Marcar que los interceptores ya están configurados
		interceptorsConfigured = true;
	},
};

// Configurar interceptores al cargar el servicio
authService.setupAxiosInterceptors();

// Establecer el token en los headers si existe al cargar el servicio
const token = authService.getToken();
if (token) {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService;
