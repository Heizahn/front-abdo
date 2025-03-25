import axios from "axios";
import { HOST_API } from "../../vite-env.d";
import { Navigate } from "react-router-dom";

const authService = {
    login: async (email: string, password: string) => {
        try {
            const response = await axios.post(`${HOST_API}/users/login`, {
                email,
                password,
            });

            if (response.data && response.data.token) {
                sessionStorage.setItem("token", response.data.token);

                authService.setupAxiosInterceptors();

                return response.data;
            }

            return null;
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    },

    profile: async () => {
        try {
            authService.setupAxiosInterceptors();
            const response = await axios.get(`${HOST_API}/whoAmI`);

            return response.data;
        } catch (error) {
            console.error("Error al obtener el perfil:", error);
            throw error;
        }
    },

    profiles: async () => {
        try {
            const response = await axios.get(`${HOST_API}/users`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener los perfiles:", error);
            throw error;
        }
    },

    logout: () => {
        sessionStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
    },

    isAuthenticated: () => {
        return !!sessionStorage.getItem("token");
    },

    getToken: () => {
        return sessionStorage.getItem("token");
    },

    setupAxiosInterceptors: () => {
        // Interceptor para manejar errores de autenticación
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    // Si recibimos un 401, limpiamos el localStorage y redirigimos al login
                    authService.logout();
                    return <Navigate to="/login" />;
                }
                return Promise.reject(error);
            }
        );

        // Configurar token en el encabezado para todas las solicitudes
        const token = authService.getToken();
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    },
};

export default authService;
