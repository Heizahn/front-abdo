import {
	Box,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	Link,
	TableSortLabel,
} from '@mui/material';
import { useState } from 'react';
import { getStateComponent } from './ClientStatus';
import { PaidRounded as PaidIcon } from '@mui/icons-material';
import { Client } from '../../interfaces/Interfaces';
import { useClients } from '../../context/ClientsContext';
import TableClientsSkeleton from '../skeletons/TableSkeleton';
import SimpleModalWrapper from '../common/ContainerForm';
import Pay from '../common/Pay';
import SendLastPay from './SendLastPay';
import SuspendedClient from '../common/SuspendedClient';
import { useNavigate } from 'react-router-dom';

// Type for sorting
type Order = 'asc' | 'desc';
type OrderBy = keyof Client;

export default function TableClients() {
	const {
		page,
		rowsPerPage,
		handleChangePage,
		handleChangeRowsPerPage,
		clients,
		loading,
		totalClients,
	} = useClients();
	const navigate = useNavigate();

	// Add sorting states
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<OrderBy>('nombre');

	// Handle sort request
	const handleRequestSort = (property: OrderBy) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	// Create sort handler
	const createSortHandler = (property: OrderBy) => () => {
		handleRequestSort(property);
	};

	const SuspendedColorCell = (client: Client) => {
		return {
			fontWeight: client.estado === 'Suspendido' ? 'normal' : 'medium',
			color: client.estado === 'Suspendido' ? 'text.secondary' : 'inherit',
		};
	};

	const handleNavigate = (clientId: string) => {
		navigate(`/client/${clientId}`);
	};

	// Sort clients
	const sortedClients = [...clients].sort((a, b) => {
		if (orderBy === 'saldo') {
			return order === 'asc' ? a.saldo - b.saldo : b.saldo - a.saldo;
		} else {
			const valueA = String(a[orderBy]).toLowerCase();
			const valueB = String(b[orderBy]).toLowerCase();
			return order === 'asc'
				? valueA.localeCompare(valueB)
				: valueB.localeCompare(valueA);
		}
	});

	return (
		<Paper
			sx={{
				flexGrow: 1,
				overflow: 'hidden',
				boxShadow: 'none',
				border: '1px solid rgba(224, 224, 224, 1)',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<TableContainer sx={{ flexGrow: 1, height: 720 }}>
				<Table stickyHeader size='small'>
					<TableHead>
						<TableRow>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'nombre'}
									direction={orderBy === 'nombre' ? order : 'asc'}
									onClick={createSortHandler('nombre')}
								>
									Nombre
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'identificacion'}
									direction={orderBy === 'identificacion' ? order : 'asc'}
									onClick={createSortHandler('identificacion')}
								>
									Identificación
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'telefonos'}
									direction={orderBy === 'telefonos' ? order : 'asc'}
									onClick={createSortHandler('telefonos')}
								>
									Teléfono
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'sector'}
									direction={orderBy === 'sector' ? order : 'asc'}
									onClick={createSortHandler('sector')}
								>
									Sector
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'router'}
									direction={orderBy === 'router' ? order : 'asc'}
									onClick={createSortHandler('router')}
								>
									Router
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'ipv4'}
									direction={orderBy === 'ipv4' ? order : 'asc'}
									onClick={createSortHandler('ipv4')}
								>
									IPv4
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'plan'}
									direction={orderBy === 'plan' ? order : 'asc'}
									onClick={createSortHandler('plan')}
								>
									Plan
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'saldo'}
									direction={orderBy === 'saldo' ? order : 'asc'}
									onClick={createSortHandler('saldo')}
								>
									Saldo
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'estado'}
									direction={orderBy === 'estado' ? order : 'asc'}
									onClick={createSortHandler('estado')}
								>
									Estado
								</TableSortLabel>
							</TableCell>
							<TableCell align='center' width={100}>
								Acciones
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableClientsSkeleton />
						) : sortedClients.length > 0 ? (
							sortedClients.map((client: Client) => (
								<TableRow
									key={client.id}
									hover
									sx={{
										borderLeft:
											client.saldo < 0
												? '4px solid #ed6c02'
												: client.estado === 'Activo' &&
												  client.saldo >= 0
												? '4px solid #2e7d32'
												: client.estado <= 'Activo'
												? '4px solid #ed6c02'
												: client.estado === 'Suspendido'
												? '4px solid #d32f2f'
												: 'none',
										cursor: 'pointer',
									}}
									onClick={() => handleNavigate(client.id)}
								>
									<TableCell
										component='th'
										scope='row'
										sx={() => SuspendedColorCell(client)}
									>
										{client.nombre}
									</TableCell>
									<TableCell sx={() => SuspendedColorCell(client)}>
										{client.identificacion}
									</TableCell>
									<TableCell sx={() => SuspendedColorCell(client)}>
										{client.telefonos}
									</TableCell>
									<TableCell sx={() => SuspendedColorCell(client)}>
										{client.sector}
									</TableCell>
									<TableCell sx={() => SuspendedColorCell(client)}>
										{client.router}
									</TableCell>
									<TableCell sx={() => SuspendedColorCell(client)}>
										<Tooltip
											title='Equipo del cliente'
											onClick={(e) => e.stopPropagation()}
										>
											<Link
												href={`http://${client.ipv4}`}
												target='_blank'
											>
												{client.ipv4}
											</Link>
										</Tooltip>
									</TableCell>
									<TableCell sx={() => SuspendedColorCell(client)}>
										{client.plan}
									</TableCell>
									<TableCell
										sx={{
											color:
												client.saldo < 0
													? 'error.main'
													: 'success.main',
										}}
									>
										{client.saldo}
									</TableCell>
									<TableCell>
										{getStateComponent(
											client.saldo < 0 ? 'Moroso' : client.estado,
										)}
									</TableCell>
									<TableCell>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
											onClick={(e) => e.stopPropagation()} // Prevenir que el clic en el botón active el modal
										>
											<Tooltip title='Cargar pago'>
												<IconButton
													size='medium'
													color='primary'
													component={({ children, ...props }) => (
														<SimpleModalWrapper
															triggerButtonText=''
															triggerButtonColor='primary'
															showCloseButton={false}
															triggerComponent={
																<IconButton {...props}>
																	{children}
																</IconButton>
															}
														>
															<Pay
																clientesId={client.id}
																clientName={client.nombre}
																onCancel={() => {}}
															/>
														</SimpleModalWrapper>
													)}
												>
													<PaidIcon
														fontSize='medium'
														color='primary'
													/>
												</IconButton>
											</Tooltip>

											<SendLastPay clientesId={client.id} />

											<SuspendedClient
												clientStatus={client.estado}
												clientId={client.id}
											/>
										</Box>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} align='center'>
									No se encontraron clientes
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Paginación */}
			<TablePagination
				component='div'
				count={totalClients}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[10, 20, 50, 100]}
				labelRowsPerPage='Filas por página:'
				labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
			/>
		</Paper>
	);
}
