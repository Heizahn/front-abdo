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
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const RecentPaymentsTable = ({ data, title = 'Últimos Pagos', maxHeight = 503 }) => {
	return (
		<Paper sx={{ width: '100%' }}>
			<Box sx={{ p: 2 }}>
				<Typography variant='h6' id='tableTitle' component='div'>
					{title}
				</Typography>
			</Box>
			<TableContainer sx={{ maxHeight: maxHeight, overflowY: 'auto' }}>
				<Table stickyHeader sx={{ minWidth: 650 }} aria-label='payments table'>
					<TableHead>
						<TableRow>
							<TableCell>Motivo</TableCell>
							<TableCell>Cliente</TableCell>
							<TableCell>Fecha</TableCell>
							<TableCell>USD</TableCell>
							<TableCell>VES</TableCell>
							<TableCell>Referencia</TableCell>
							<TableCell>Estado</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((row) => (
							<TableRow
								key={row.id}
								sx={{
									'&:last-child td, &:last-child th': { border: 0 },
								}}
							>
								<TableCell component='th' scope='row'>
									{row.motivo}
								</TableCell>
								<TableCell>{row.cliente}</TableCell>
								<TableCell>{row.fecha}</TableCell>
								<TableCell>{row.usd}</TableCell>
								<TableCell>{row.ves}</TableCell>
								<TableCell>{row.referencia}</TableCell>
								<TableCell>
									{row.estado === 'active' ? (
										<FiberManualRecordIcon
											sx={{
												color: 'success.main',
												fontSize: 12,
											}}
										/>
									) : (
										<FiberManualRecordIcon
											sx={{ color: 'error.main', fontSize: 12 }}
										/>
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
