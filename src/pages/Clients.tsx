import { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MainLayout from '../layouts/MainLayout';

import TableClients from '../components/clients/TableClients';
import FilterStatusList from '../components/clients/filterStatusList';

// Importar datos mockeados
import { mockClients, clientStats } from '../data/mockClients';

export default function Clients() {
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
	const [clientStatsFiltered, setClientStatsFiltered] = useState({
		todos: true,
		solventes: false,
		morosos: false,
		suspendidos: false,
		retirados: false,
	});

	// Estados para paginación
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);

	// Implementar debounce para la búsqueda
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 300);

		return () => {
			clearTimeout(timer);
		};
	}, [searchQuery]);

	// Manejar cambio en la búsqueda
	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
		setPage(0); // Reset page when search changes
	};

	// Manejar cambio de página
	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	// Manejar cambio de filas por página
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Obtener clientes filtrados
	const filteredClients = () => {
		let filtered = mockClients.filter(
			(client) =>
				client.nombre.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
				client.identificacion
					.toLowerCase()
					.includes(debouncedSearchQuery.toLowerCase()) ||
				client.telefono.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
				client.sector.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
				client.router.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
				client.ipv4.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
				client.plan.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
				client.saldo.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
		);

		// Luego filtramos por estado, solo si no está seleccionado "todos"
		if (!clientStatsFiltered.todos) {
			console.log(filtered);
			filtered = filtered.filter((client) => {
				if (clientStatsFiltered.solventes && client.estado === 'Activo') return true;
				if (clientStatsFiltered.morosos && client.estado === 'Moroso') return true;
				if (clientStatsFiltered.suspendidos && client.estado === 'Suspendido')
					return true;
				if (clientStatsFiltered.retirados && client.estado === 'Retirado') return true;
				return false;
			});
		}

		return filtered;
	};

	// Obtener clientes paginados
	const paginatedClients = () => {
		const filtered = filteredClients();
		return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
	};

	// Obtener el color según el estado

	return (
		<MainLayout title='Clientes'>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
					height: '95%',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						bgcolor: 'background.default',
						paddingRight: 4,
						paddingBottom: 0.2,
						borderTopLeftRadius: 8,
						borderTopRightRadius: 8,
					}}
				>
					<Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
						<FilterStatusList
							clientStats={clientStats}
							clientStatsFiltered={clientStatsFiltered}
							setClientStatsFiltered={setClientStatsFiltered}
						/>
					</Box>

					<Button color='primary' variant='contained'>
						Crear
					</Button>
				</Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						p: 1,
						bgcolor: 'background.default',
					}}
				>
					<Typography variant='h6'>Clientes</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<TextField
							placeholder='Buscar'
							variant='outlined'
							size='small'
							value={searchQuery}
							onChange={handleSearchChange}
							InputProps={{
								startAdornment: (
									<InputAdornment position='start'>
										<SearchIcon />
									</InputAdornment>
								),
							}}
						/>
					</Box>
				</Box>

				<TableClients
					filteredClients={filteredClients}
					paginatedClients={paginatedClients}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					page={page}
					rowsPerPage={rowsPerPage}
				/>
			</Box>
		</MainLayout>
	);
}
