import { Chip } from '@mui/material';

const StatusBadge = ({ status, saldo }: { status: string | null; saldo?: number | null }) => {
	const isActive = status?.toLowerCase() === 'activo';
	const isMoroso = saldo && saldo < 0;

	return (
		<Chip
			label={status}
			size='small'
			color={
				isActive && isMoroso ? 'warning' : isActive && !isMoroso ? 'success' : 'error'
			}
		/>
	);
};

export default StatusBadge;
