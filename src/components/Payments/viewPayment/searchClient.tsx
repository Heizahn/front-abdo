import { useState, useEffect, useMemo } from 'react';
import {
	Box,
	TextField,
	Button,
	Paper,
	Typography,
	IconButton,
	InputAdornment,
	CircularProgress,
} from '@mui/material';
import {
	Search as SearchIcon,
	Clear as ClearIcon,
	Assignment as DocumentIcon,
} from '@mui/icons-material';
import ClientDetail from './clientDetail';
import { getClient } from '../../../services/getClient';
import { getBCV } from '../../../services/BCBService';
import PricePanel from './pricePanel';
import { useQuery } from '@tanstack/react-query';
import { IClientPayment } from '../../../interfaces/Interfaces';
import { useBuildParams } from '../../../hooks/useBuildParams';
import { ROLES, useAuth } from '../../../context/AuthContext';
import Proveedor from './proveedor';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchClient = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Obtener el valor de búsqueda de la URL al cargar el componente
	const searchParams = new URLSearchParams(location.search);
	const searchQuery = searchParams.get('search') || '';
	const providerQuery = searchParams.get('provider') || '';

	const [identificacion, setIdentificacion] = useState(searchQuery);
	const [loading, setLoading] = useState(false);
	const [clients, setClients] = useState<IClientPayment[]>([]);
	const [error, setError] = useState('');
	const [searching, setSearching] = useState(false);
	const [bcvData, setBcvData] = useState<{ precio: number; fecha: string } | null>(null);
	const [clientList, setClientList] = useState<string>(providerQuery);

	const { user } = useAuth();

	const buildParams = useBuildParams() || `?provider=${clientList}`;

	const { data } = useQuery({
		queryKey: ['bcvData'],
		queryFn: async () => {
			const bcvData = await getBCV();
			return bcvData;
		},
	});

	const handleClientChange = (client: string) => {
		setClientList(client);

		//Actualizar el parametro provider en la url
		const params = new URLSearchParams(location.search);
		params.set('provider', client);
		navigate({ search: params.toString() }, { replace: true });
	};

	const disableButton = useMemo(() => {
		if (user?.nRole !== ROLES.PROVIDER && !clientList) return true;

		return false;
	}, [user?.nRole, clientList]);

	useEffect(() => {
		try {
			if (data) {
				setBcvData((prevState) => ({
					...prevState,
					precio: data,
					fecha: new Date().toLocaleDateString(),
				}));
			}
		} catch (error) {
			console.error('Error obteniendo datos del BCV:', error);
		}
	}, [data]);

	// Efecto para realizar búsqueda automática si hay un valor en la URL
	useEffect(() => {
		if (searchQuery && (user?.nRole === ROLES.PROVIDER || clientList)) {
			handleSearch();
		}
	}, []);

	// Función separada para búsqueda que puede reutilizarse
	const handleSearch = async () => {
		if (!identificacion) {
			setError('Por favor ingrese un nombre, cédula o identificación');
			return;
		}

		setLoading(true);
		setSearching(true);
		setClients([]);
		setError('');

		try {
			const response = await getClient(identificacion, buildParams);

			if (response.length === 0) {
				setError('No se encontraron clientes con esa búsqueda');
				return;
			}
			setClients(response);
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error al buscar cliente:', error);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e?.preventDefault();

		// Actualizar la URL con el valor de búsqueda
		const params = new URLSearchParams(location.search);
		params.set('search', identificacion);
		navigate({ search: params.toString() }, { replace: true });

		handleSearch();
	};

	const handleClear = () => {
		setIdentificacion('');
		setClients([]);
		setError('');
		setSearching(false);

		// Eliminar el parámetro de búsqueda de la URL
		const params = new URLSearchParams(location.search);
		params.delete('search');
		navigate({ search: params.toString() }, { replace: true });
	};

	const refetchSearch = (clients: IClientPayment[]) => {
		setClients(clients);
		setSearching(false);
		setLoading(false);
		setError('');
	};

	return (
		<>
			{/* Panel de información de precios */}
			{bcvData && <PricePanel bcvData={bcvData} />}

			{/* Panel de búsqueda */}
			<Paper
				sx={{
					p: 3,
					borderRadius: 2,
					mb: 4,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 2,
					}}
				>
					<Typography component='h2' variant='h5'>
						Búsqueda de cliente
					</Typography>
					{user?.nRole !== ROLES.PROVIDER && (
						<Proveedor handleClientChange={handleClientChange} />
					)}
				</Box>
				<Box component='form' onSubmit={handleSubmit}>
					<TextField
						fullWidth
						id='identificacion'
						label='Nombre, Cédula o Teléfono'
						variant='outlined'
						value={identificacion}
						onChange={(e) => setIdentificacion(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<DocumentIcon />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position='end'>
									{identificacion && (
										<IconButton
											aria-label='clear search'
											onClick={handleClear}
											edge='end'
										>
											<ClearIcon />
										</IconButton>
									)}
								</InputAdornment>
							),
						}}
						placeholder='Ej: 12345678'
						autoFocus
					/>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mt: 2,
						}}
					>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							startIcon={loading ? null : <SearchIcon />}
							disabled={loading || !identificacion || disableButton}
						>
							{loading ? (
								<CircularProgress size={24} color='inherit' />
							) : (
								'Buscar Cliente'
							)}
						</Button>
					</Box>

					{error && (
						<Typography color='error' sx={{ mt: 2, textAlign: 'center' }}>
							{error}
						</Typography>
					)}
				</Box>
			</Paper>

			{searching && !loading && !error && !clients && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						mt: 4,
					}}
				>
					<Typography variant='h6'>
						No se encontraron resultados para "{identificacion}"
					</Typography>
				</Box>
			)}

			{/* Resultados de la búsqueda */}
			{clients &&
				clients.length > 0 &&
				clients.map((client) => (
					<ClientDetail
						key={client.id}
						client={client}
						refetchSearch={refetchSearch}
						buildParams={buildParams}
					/>
				))}
		</>
	);
};

export default SearchClient;
