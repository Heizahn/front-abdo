import {
	CardContent,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { ILastInvoice } from '../../../interfaces/Interfaces';
import { formatDate } from '../../../services/formaterDate';

interface Props {
	invoices: ILastInvoice[];
}

export default function LastInvoices({ invoices }: Props) {
	if (invoices.length === 0) {
		return (
			<CardContent sx={{ paddingTop: 0 }}>
				<Typography
					variant='body2'
					color='text.secondary'
					align='center'
					sx={{ py: 2 }}
				>
					No hay facturas registradas para este cliente.
				</Typography>
			</CardContent>
		);
	}
	return (
		<CardContent sx={{ paddingTop: 0 }}>
			<TableContainer component={Paper} variant='outlined'>
				<Table size='small'>
					<TableHead>
						<TableRow sx={{ bgcolor: 'primary.light' }}>
							<TableCell sx={{ fontWeight: 'bold' }}>Motivo</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Monto (USD)
							</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Deuda (USD)
							</TableCell>
							<TableCell align='right' sx={{ fontWeight: 'bold' }}>
								Estado
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{invoices.map((invoice) => (
							<TableRow
								key={invoice.id}
								sx={{
									minHeight: 37,
									height: 37,
									maxHeight: 37,
									paddingY: 1,
								}}
							>
								<TableCell>{invoice.sReason}</TableCell>
								<TableCell>{formatDate(invoice.dCreation)}</TableCell>
								<TableCell align='right'>
									<Typography
										variant='body2'
										fontWeight='medium'
										color='primary.dark'
									>
										{invoice.nAmount || '0'}
									</Typography>
								</TableCell>
								<TableCell align='right'>
									<Typography
										variant='body2'
										fontWeight='medium'
										color='primary.dark'
									>
										{invoice.debt || '0'}
									</Typography>
								</TableCell>
								<TableCell
									align='right'
									sx={{
										color: `${
											invoice.sState === 'Activo'
												? 'success.main'
												: 'error.main'
										}`,
									}}
								>
									{invoice.sState}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</CardContent>
	);
}
