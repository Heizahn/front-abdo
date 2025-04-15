import {
	Box,
	IconButton,
	Paper,
	Table,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
	Link,
	TableSortLabel,
	Typography,
	LinearProgress,
	styled,
} from '@mui/material';
import { useState, useEffect, useRef, useCallback, useMemo, CSSProperties } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { getStateComponent } from './ClientStatus';
import { PaidRounded as PaidIcon } from '@mui/icons-material';
import { Client } from '../../interfaces/Interfaces';
import { useClients } from '../../context/ClientsContext';
import SimpleModalWrapper from '../common/ContainerForm';
import Pay from '../common/Pay';
import SendLastPay from './SendLastPay';
import SuspendedClient from '../common/SuspendedClient';
import { useNavigate } from 'react-router-dom';

// Type for sorting
type Order = 'asc' | 'desc';
type OrderBy = keyof Client;

// Tamaño de cada fila en píxeles
const ROW_HEIGHT = 42;

// Estilos usando styled de Material UI
const StyledTableCell = styled(TableCell)(() => ({
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	padding: '6px 16px',
	height: '100%',
	'&:first-of-type': {
		paddingLeft: 16,
	},
	'&:last-of-type': {
		paddingRight: 16,
	},
}));

const StyledTableRow = styled(TableRow)({
	display: 'flex',
	flexDirection: 'row',
	width: '100%',
});

export default function TableClients() {
	const { filteredClients, loading } = useClients();
	const navigate = useNavigate();

	// Add sorting states
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<OrderBy>('nombre');
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	// Referencia a la lista virtualizada
	const listRef = useRef<List>(null);

	// Detectar cuando se completa la carga inicial
	useEffect(() => {
		if (filteredClients.length > 0 && isInitialLoad) {
			setIsInitialLoad(false);
		}
	}, [filteredClients, isInitialLoad]);

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

	const handleNavigate = useCallback(
		(clientId: string) => {
			navigate(`/client/${clientId}`);
		},
		[navigate],
	);

	// Obtener los clientes ordenados
	const sortedClients = useMemo(() => {
		// Aplicar el orden a todos los clientes filtrados
		return [...filteredClients].sort((a, b) => {
			if (orderBy === 'saldo') {
				return order === 'asc' ? a.saldo - b.saldo : b.saldo - a.saldo;
			} else {
				const valueA = String(a[orderBy] || '').toLowerCase();
				const valueB = String(b[orderBy] || '').toLowerCase();
				return order === 'asc'
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			}
		});
	}, [filteredClients, order, orderBy]);

	// Determinar el estado real del cliente basado en saldo y estado
	const getClientRealState = (client: Client) => {
		if (client.estado === 'Suspendido') return 'Suspendido';
		if (client.estado === 'Retirado') return 'Retirado';
		return client.saldo < 0 ? 'Moroso' : 'Activo';
	};

	// Renderizar una fila de la tabla (usado por la virtualización)
	const Row = useCallback(
		({ index, style }: { index: number; style: CSSProperties }) => {
			const client = sortedClients[index];

			// Si no hay datos para este índice, no renderizar nada
			if (!client) return null;

			return (
				<StyledTableRow
					hover
					style={{
						...style,
						height: ROW_HEIGHT,
						boxSizing: 'border-box',
					}}
					sx={{
						borderLeft:
							client.saldo < 0 && client.estado === 'Activo'
								? '4px solid #ed6c02'
								: client.estado === 'Activo' && client.saldo >= 0
								? '4px solid #2e7d32'
								: client.estado === 'Suspendido'
								? '4px solid #d32f2f'
								: '4px solid #b0b0b0',
						cursor: 'pointer',
					}}
					onClick={() => handleNavigate(client.id)}
				>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '20%',
						}}
						sx={() => SuspendedColorCell(client)}
					>
						{client.nombre}
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '10%',
						}}
						sx={() => SuspendedColorCell(client)}
					>
						{client.identificacion}
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '10%',
						}}
						sx={() => SuspendedColorCell(client)}
					>
						{client.telefonos}
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '10%',
						}}
						sx={() => SuspendedColorCell(client)}
					>
						{client.sector}
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '10%',
						}}
						sx={() => SuspendedColorCell(client)}
					>
						{client.router}
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '10%',
						}}
						sx={() => SuspendedColorCell(client)}
					>
						<Tooltip
							title='Equipo del cliente'
							onClick={(e) => e.stopPropagation()}
						>
							<Link href={`http://${client.ipv4}`} target='_blank'>
								{client.ipv4}
							</Link>
						</Tooltip>
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '10%',
						}}
						sx={() => SuspendedColorCell(client)}
					>
						{client.plan}
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '5%',
						}}
						sx={{
							color: client.saldo < 0 ? 'error.main' : 'success.main',
						}}
					>
						{client.saldo}
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
							width: '8%',
						}}
					>
						{getStateComponent(getClientRealState(client))}
					</StyledTableCell>
					<StyledTableCell
						component='div'
						variant='body'
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							height: '100%',
							width: '8%',
						}}
					>
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
									size='small'
									color='primary'
									component={({ children, ...props }) => (
										<SimpleModalWrapper
											triggerButtonText=''
											triggerButtonColor='primary'
											showCloseButton={false}
											triggerComponent={
												<IconButton {...props} size='small'>
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
									<PaidIcon fontSize='small' color='primary' />
								</IconButton>
							</Tooltip>

							<SendLastPay clientesId={client.id} />

							<SuspendedClient
								clientStatus={client.estado}
								clientId={client.id}
							/>
						</Box>
					</StyledTableCell>
				</StyledTableRow>
			);
		},
		[sortedClients, handleNavigate],
	);

	// Renderizar contenido según el estado de carga
	const renderTableContent = () => {
		if (sortedClients.length === 0 && !loading) {
			return (
				<Box sx={{ p: 3, textAlign: 'center' }}>
					<Typography variant='subtitle1'>No se encontraron clientes</Typography>
				</Box>
			);
		}

		// Usar AutoSizer para que la lista se ajuste al contenedor
		return (
			<AutoSizer>
				{({ height, width }) => (
					<List
						ref={listRef}
						height={height}
						itemCount={sortedClients.length}
						itemSize={ROW_HEIGHT}
						width={width}
						overscanCount={20} // Número de elementos adicionales a renderizar arriba y abajo
					>
						{Row}
					</List>
				)}
			</AutoSizer>
		);
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
				position: 'relative',
			}}
		>
			{/* Encabezados de la tabla */}
			<Box sx={{ overflowX: 'auto', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
				<Table size='small'>
					<TableHead>
						<StyledTableRow sx={{ height: ROW_HEIGHT }}>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '20%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'nombre'}
									direction={orderBy === 'nombre' ? order : 'asc'}
									onClick={createSortHandler('nombre')}
								>
									Nombre
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '12%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'identificacion'}
									direction={orderBy === 'identificacion' ? order : 'asc'}
									onClick={createSortHandler('identificacion')}
								>
									Identificación
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '10%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'telefonos'}
									direction={orderBy === 'telefonos' ? order : 'asc'}
									onClick={createSortHandler('telefonos')}
								>
									Teléfono
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '10%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'sector'}
									direction={orderBy === 'sector' ? order : 'asc'}
									onClick={createSortHandler('sector')}
								>
									Sector
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '10%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'router'}
									direction={orderBy === 'router' ? order : 'asc'}
									onClick={createSortHandler('router')}
								>
									Router
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '10%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'ipv4'}
									direction={orderBy === 'ipv4' ? order : 'asc'}
									onClick={createSortHandler('ipv4')}
								>
									IPv4
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '8%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'plan'}
									direction={orderBy === 'plan' ? order : 'asc'}
									onClick={createSortHandler('plan')}
								>
									Plan
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '7%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'saldo'}
									direction={orderBy === 'saldo' ? order : 'asc'}
									onClick={createSortHandler('saldo')}
								>
									Saldo
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{ width: '8%', display: 'flex', alignItems: 'center' }}
							>
								<TableSortLabel
									active={orderBy === 'estado'}
									direction={orderBy === 'estado' ? order : 'asc'}
									onClick={createSortHandler('estado')}
								>
									Estado
								</TableSortLabel>
							</StyledTableCell>
							<StyledTableCell
								component='div'
								variant='head'
								style={{
									width: '10%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								Acciones
							</StyledTableCell>
						</StyledTableRow>
					</TableHead>
				</Table>
			</Box>

			{/* Cuerpo virtualizado de la tabla */}
			<Box sx={{ flex: 1, overflow: 'hidden' }}>{renderTableContent()}</Box>

			{/* Indicador sutil en la parte superior */}
			<Box
				sx={{
					borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					px: 2,
					py: 1,
				}}
			>
				<Typography
					variant='caption'
					color='text.secondary'
					sx={{ fontSize: '0.75rem' }}
				>
					{sortedClients.length} clientes
				</Typography>

				{loading && (
					<LinearProgress sx={{ width: '30%', ml: 2, height: 4, borderRadius: 2 }} />
				)}
			</Box>
		</Paper>
	);
}
