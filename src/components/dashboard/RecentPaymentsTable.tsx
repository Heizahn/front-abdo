import {
	Paper,
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { useFetchData } from '../../hooks/useQuery';
import { LastPays } from '../../interfaces/Interfaces';
import { formatDate } from '../../services/formaterDate';

const RecentPaymentsTable = () => {
	const { data, isLoading, error } = useFetchData<LastPays[]>(
		'/dashboard/payments/last',
		'lastPays',
	);

	if (error) {
		return <div>Hubo un error al cargar los pagos</div>;
	}

	if (isLoading) {
		return <div>Cargando...</div>;
	}

	return (
		<Paper sx={{ width: '100%' }}>
			<Box sx={{ p: 2 }}>
				<Typography variant='h6' id='tableTitle' component='div'>
					{'Últimos Pagos'}
				</Typography>
			</Box>
			<TableContainer sx={{ maxHeight: 503, overflowY: 'auto' }}>
				<Table
					stickyHeader
					sx={{ minWidth: 650 }}
					aria-label='payments table'
					size='small'
				>
					<TableHead>
						<TableRow>
							<TableCell>Motivo</TableCell>
							<TableCell>Cliente</TableCell>
							<TableCell>Fecha</TableCell>
							<TableCell>Monto (USD)</TableCell>
							<TableCell>Monto (Bs)</TableCell>
							<TableCell>Tipo de Pago</TableCell>
							<TableCell>Referencia</TableCell>
							<TableCell>Estado</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map((row, idx) => (
							<TableRow
								key={idx}
								sx={{
									'&:last-child td, &:last-child th': {
										border: 0,
									},
								}}
							>
								<TableCell component='th' scope='row'>
									{row.sReason}
								</TableCell>
								<TableCell>{row.clientName}</TableCell>
								<TableCell>{formatDate(row.dCreation)}</TableCell>
								<TableCell>{row.nAmount}</TableCell>
								<TableCell>{row.nBs}</TableCell>
								<TableCell>{row.sReference}</TableCell>
								<TableCell>{row.bCash ? 'Efectivo' : 'Digital'}</TableCell>
								<TableCell>
									{row.sState === 'Activo' ? (
										<Typography color='success'>Activo</Typography>
									) : (
										<Typography color='error'>Inactivo</Typography>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default RecentPaymentsTable;
