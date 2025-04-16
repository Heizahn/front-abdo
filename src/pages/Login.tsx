import { useState } from 'react';
import {
	Box,
	Container,
	TextField,
	Button,
	Paper,
	InputAdornment,
	IconButton,
	CircularProgress,
	Snackbar,
	Alert,
	Toolbar,
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authServices';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import logo from '../assets/logo.svg';
const Login = () => {
	const [credentials, setCredentials] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [openSnackbar, setOpenSnackbar] = useState(false);

	const navigate = useNavigate();
	const { loadUser } = useAuth();
	const { notifySuccess } = useNotification();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!credentials.email || !credentials.password) {
			setError('Por favor ingrese usuario y contraseña');
			setOpenSnackbar(true);
			return;
		}

		setLoading(true);

		try {
			await authService.login(credentials.email, credentials.password);
			loadUser();
			notifySuccess('Sesión iniciada correctamente', 'Sesión iniciada');
			navigate('/home');
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error durante el login:', error.message);
				setError(error.message || 'Error al iniciar sesión');
				setOpenSnackbar(true);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	return (
		<Container component='main' maxWidth='xs'>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
				}}
			>
				<Paper
					elevation={3}
					sx={{
						p: 4,
						width: '100%',
						borderRadius: 2,
					}}
				>
					<Toolbar>
						<img src={logo} alt='logo' width='100%' />
					</Toolbar>

					<Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
						<TextField
							margin='normal'
							required
							fullWidth
							id='email'
							label='Usuario'
							name='email'
							autoComplete='email'
							autoFocus
							value={credentials.email}
							onChange={handleChange}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Person />
									</InputAdornment>
								),
							}}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Contraseña'
							type={showPassword ? 'text' : 'password'}
							id='password'
							autoComplete='current-password'
							value={credentials.password}
							onChange={handleChange}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<Lock />
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowPassword}
											edge='end'
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2, py: 1.5 }}
							disabled={loading}
						>
							{loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
						</Button>
					</Box>
				</Paper>
			</Box>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
			>
				<Alert onClose={handleCloseSnackbar} severity='error' sx={{ width: '100%' }}>
					{error}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default Login;
