import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Aquí podrías enviar el error a un servicio de logging
		console.error("Error en la aplicación:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <ErrorDisplay error={this.state.error} />;
		}

		return this.props.children;
	}
}

// Componente para mostrar el error
const ErrorDisplay = ({ error }: { error?: Error }) => {
	const navigate = useNavigate();

	const handleRetry = () => {
		// Recarga la página actual
		window.location.reload();
	};

	const handleGoBack = () => {
		// Regresa a la página anterior
		navigate(-1);
	};

	const handleGoHome = () => {
		// Navega al inicio
		navigate("/");
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
				padding: 3,
				backgroundColor: (theme) =>
					theme.palette.mode === "dark"
						? "rgba(0, 0, 0, 0.9)"
						: "rgba(255, 255, 255, 0.9)",
			}}
		>
			<ErrorOutlineIcon
				sx={{
					fontSize: 64,
					color: "error.main",
					marginBottom: 2,
				}}
			/>

			<Typography variant="h5" color="error" gutterBottom>
				¡Ups! Algo salió mal
			</Typography>

			<Typography
				variant="body1"
				color="text.secondary"
				align="center"
				sx={{ maxWidth: 500, mb: 3 }}
			>
				{error?.message ||
					"Ha ocurrido un error al cargar esta página."}
			</Typography>

			<Box sx={{ display: "flex", gap: 2 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleRetry}
				>
					Intentar de nuevo
				</Button>

				<Button variant="outlined" onClick={handleGoBack}>
					Volver atrás
				</Button>

				<Button variant="text" onClick={handleGoHome}>
					Ir al inicio
				</Button>
			</Box>
		</Box>
	);
};

export default ErrorBoundary;
