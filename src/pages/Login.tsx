import { useState, useEffect } from "react";
import {
	Box,
	Container,
	TextField,
	Button,
	Paper,
	InputAdornment,
	IconButton,
	CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import authService from "../services/authServices";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import logo from "../assets/logo.svg";

const Login = () => {
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formErrors, setFormErrors] = useState({
		email: "",
		password: "",
		general: "",
	});

	const navigate = useNavigate();
	const { loadUser, isAuthenticated } = useAuth();
	const { notifyError, notifySuccess, notifyWarning } = useNotification();

	// Verificar autenticación al cargar
	useEffect(() => {
		const checkAuth = async () => {
			if (isAuthenticated()) {
				try {
					await loadUser();
					navigate("/");
				} catch (error) {
					console.error("Error verificando autenticación:", error);
					// Limpiar estado si hay error de autenticación
					await authService.logout();
				}
			}
		};

		checkAuth();
	}, [isAuthenticated, loadUser, navigate]);

	const validateForm = () => {
		const errors = {
			email: "",
			password: "",
			general: "",
		};
		let isValid = true;

		// Validar email
		if (!credentials.email) {
			errors.email = "El correo es requerido";
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
			errors.email = "Ingrese un correo válido";
			isValid = false;
		}

		// Validar password
		if (!credentials.password) {
			errors.password = "La contraseña es requerida";
			isValid = false;
		}

		setFormErrors(errors);
		return isValid;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({
			...prev,
			[name]: value,
		}));
		// Limpiar error del campo cuando el usuario empieza a escribir
		if (formErrors[name as keyof typeof formErrors]) {
			setFormErrors((prev) => ({
				...prev,
				[name]: "",
				general: "",
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validar formulario antes de intentar login
		if (!validateForm()) {
			notifyWarning("Por favor, complete todos los campos correctamente");
			return;
		}

		setLoading(true);
		setFormErrors({ email: "", password: "", general: "" });

		try {
			// Intentar login
			await authService.login(credentials.email, credentials.password);

			// Esperar a que el token se establezca
			await new Promise((resolve) => setTimeout(resolve, 100));

			try {
				// Intentar cargar el perfil
				await loadUser();

				// Si llegamos aquí, el login fue exitoso
				notifySuccess(
					"¡Bienvenido de nuevo!",
					"Inicio de sesión exitoso"
				);
				navigate("/");
			} catch (profileError) {
				// Si hay error al cargar el perfil, pero el login fue exitoso
				console.error("Error al cargar el perfil:", profileError);
				// Aún así navegamos porque el login fue exitoso
				notifySuccess(
					"¡Bienvenido de nuevo!",
					"Inicio de sesión exitoso"
				);
				navigate("/");
			}
		} catch (error) {
			// Manejar diferentes tipos de errores de login
			let errorMessage = "Error al iniciar sesión";

			if (error instanceof Error) {
				if (error.message.includes("401")) {
					errorMessage = "Credenciales incorrectas";
				} else if (error.message.includes("422")) {
					errorMessage =
						"El correo electrónico o la contraseña no cumplen el formato requerido";
				} else if (error.message.includes("Network")) {
					errorMessage = "Error de conexión. Verifique su internet";
				} else {
					errorMessage = error.message;
				}
			}

			setFormErrors((prev) => ({
				...prev,
				general: errorMessage,
			}));

			notifyError(errorMessage, "Error de autenticación");

			// Limpiar la contraseña en caso de error
			setCredentials((prev) => ({
				...prev,
				password: "",
			}));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container
			component="main"
			maxWidth="xs"
			sx={{ height: "100vh", display: "flex", alignItems: "center" }}
		>
			<Paper
				elevation={3}
				sx={{
					padding: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: "100%",
				}}
			>
				<img
					src={logo}
					alt="Logo"
					style={{ height: 100, marginBottom: 20 }}
				/>
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{ mt: 1, width: "100%" }}
				>
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Correo electrónico"
						name="email"
						autoComplete="email"
						autoFocus
						value={credentials.email}
						onChange={handleChange}
						error={!!formErrors.email}
						helperText={formErrors.email}
						disabled={loading}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Person />
								</InputAdornment>
							),
						}}
					/>

					<TextField
						margin="normal"
						required
						fullWidth
						name="password"
						label="Contraseña"
						type={showPassword ? "text" : "password"}
						id="password"
						autoComplete="current-password"
						value={credentials.password}
						onChange={handleChange}
						error={!!formErrors.password}
						helperText={formErrors.password}
						disabled={loading}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										edge="end"
									>
										{showPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2, py: 1.5 }}
						disabled={loading}
					>
						{loading ? (
							<CircularProgress size={24} />
						) : (
							"Iniciar Sesión"
						)}
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};

export default Login;
