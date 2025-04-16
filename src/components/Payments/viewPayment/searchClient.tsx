import { useState, useEffect } from 'react';
import {
	Box,
	TextField,
	Button,
	Paper,
	Typography,
	IconButton,
	InputAdornment,
	CircularProgress,
	FormControl,
	Select,
	MenuItem,
	SelectChangeEvent,
} from '@mui/material';
import {
	Search as SearchIcon,
	Clear as ClearIcon,
	Assignment as DocumentIcon,
} from '@mui/icons-material';
import ClientDetail from './clientDetail';
import { getClient } from '../../../services/getClient';
import { useClientList } from '../../../hooks/useClientList';
import { getBCV } from '../../../services/BCBService';
import PricePanel from './pricePanel';
import { useQuery } from '@tanstack/react-query';

const SearchClient = () => {
	const [identificacion, setIdentificacion] = useState('');
	const [loading, setLoading] = useState(false);
	const [clients, setClients] = useState([]);
	const [error, setError] = useState('');
	const [searching, setSearching] = useState(false);
	const [bcvData, setBcvData] = useState<{ precio: number; fecha: string } | null>(null);
	const { clientList, handleClientChange } = useClientList();

	const { data } = useQuery({
		queryKey: ['bcvData'],
		queryFn: async () => {
			const bcvData = await getBCV();
			return bcvData;
		},
	});

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

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e?.preventDefault();

		if (!identificacion) {
			setError('Por favor ingrese un nombre, cédula o identificación');
			return;
		}

		setLoading(true);
		setSearching(true);
		setClients([]);
		setError('');

		try {
			const response = await getClient(identificacion, clientList);

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

	const handleClear = () => {
		setIdentificacion('');
		setClients([]);
		setError('');
		setSearching(false);
	};

	return (
		<>
			{/* Panel de información de precios */}
			<PricePanel bcvData={bcvData} />

			{/* Panel de búsqueda */}
			<Paper
				elevation={2}
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
					<Typography component='h1' variant='h5'>
						Búsqueda de cliente
					</Typography>
					<FormControl sx={{ minWidth: 160, mr: 2 }} size='small'>
						<Select
							value={clientList}
							onChange={(event: SelectChangeEvent<string>) =>
								handleClientChange(event.target.value)
							}
							sx={{
								borderRadius: 1,
								'& .MuiSelect-icon': { color: 'white' },
							}}
							displayEmpty
						>
							<MenuItem value='ABDO77'>ABDO77</MenuItem>
							<MenuItem value='Gianni'>Gianni</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box component='form' onSubmit={handleSearch}>
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
							variant='contained'
							color='primary'
							startIcon={loading ? null : <SearchIcon />}
							onClick={handleSearch}
							disabled={loading || !identificacion}
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
						setClients={setClients}
						onNewSearch={handleClear}
					/>
				))}
		</>
	);
};

export default SearchClient;
