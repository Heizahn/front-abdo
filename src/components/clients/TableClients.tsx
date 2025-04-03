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
} from '@mui/material';
import { getStateComponent } from './ClientStatus';
import { PaidOutlined as PaidIcon } from '@mui/icons-material';
import { Client } from '../../interfaces/Interfaces';
import { useClients } from '../../context/ClientsContext';
import TableClientsSkeleton from '../skeletons/TableSkeleton';
import SimpleModalWrapper from '../common/ContainerForm';
import Pay from '../common/Pay';
import SendLastPay from './SendLastPay';
import SuspendedClient from '../common/SuspendedClient';
import { useNavigate, Link } from 'react-router-dom';

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

	const SuspendedColorCell = (client: Client) => {
		return {
			fontWeight: client.estado === 'Suspendido' ? 'normal' : 'medium',
			color: client.estado === 'Suspendido' ? 'text.secondary' : 'inherit',
		};
	};

	const handleNavigate = (clientId: string) => {
		navigate(`/client/${clientId}`);
	};

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
			<TableContainer sx={{ flexGrow: 1, height: 'calc(100vh - 80rem)' }}>
				<Table stickyHeader size='small'>
					<TableHead>
						<TableRow>
							<TableCell>Nombre</TableCell>
							<TableCell>Identificación</TableCell>
							<TableCell>Teléfono</TableCell>
							<TableCell>Sector</TableCell>
							<TableCell>Router</TableCell>
							<TableCell>IPv4</TableCell>
							<TableCell>Plan</TableCell>
							<TableCell>Saldo</TableCell>
							<TableCell>Estado</TableCell>
							<TableCell align='center' width={100}>
								Acciones
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableClientsSkeleton />
						) : clients.length > 0 ? (
							clients.map((client: Client) => (
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
								>
									<TableCell
										component='th'
										scope='row'
										sx={() => SuspendedColorCell(client)}
										onClick={() => handleNavigate(client.id)}
									>
										{client.nombre}
									</TableCell>
									<TableCell
										sx={() => SuspendedColorCell(client)}
										onClick={() => handleNavigate(client.id)}
									>
										{client.identificacion}
									</TableCell>
									<TableCell
										sx={() => SuspendedColorCell(client)}
										onClick={() => handleNavigate(client.id)}
									>
										{client.telefonos}
									</TableCell>
									<TableCell
										sx={() => SuspendedColorCell(client)}
										onClick={() => handleNavigate(client.id)}
									>
										{client.sector}
									</TableCell>
									<TableCell
										sx={() => SuspendedColorCell(client)}
										onClick={() => handleNavigate(client.id)}
									>
										{client.router}
									</TableCell>
									<TableCell
										sx={() => SuspendedColorCell(client)}
										style={{ cursor: 'default' }}
									>
										<Link to={`http://${client.ipv4}`} target='_blank'>
											{client.ipv4}
										</Link>
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
										onClick={() => handleNavigate(client.id)}
									>
										{client.saldo}
									</TableCell>
									<TableCell onClick={() => handleNavigate(client.id)}>
										{getStateComponent(
											client.saldo < 0 ? 'Moroso' : client.estado,
										)}
									</TableCell>
									<TableCell>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											<IconButton
												size='medium'
												title='Subir pago'
												color='primary'
												component={({ children, ...props }) => (
													<SimpleModalWrapper
														triggerButtonText=''
														triggerButtonColor='primary'
														triggerTooltip='Subir pago'
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
												<PaidIcon fontSize='medium' color='primary' />
											</IconButton>

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
