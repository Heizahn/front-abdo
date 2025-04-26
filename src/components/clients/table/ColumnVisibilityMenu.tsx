import { useState } from 'react';
import {
	IconButton,
	Menu,
	MenuItem,
	FormControlLabel,
	Checkbox,
	Box,
	Typography,
	Divider,
} from '@mui/material';
import { ViewColumn as ViewColumnIcon } from '@mui/icons-material';

interface ColumnVisibilityMenuProps {
	visibleColumns: Record<string, boolean>;
	onColumnVisibilityChange: (column: string, visible: boolean) => void;
}

export const ColumnVisibilityMenu = ({
	visibleColumns,
	onColumnVisibilityChange,
}: ColumnVisibilityMenuProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const columns = [
		{ id: 'identificacion', label: 'Identificación' },
		{ id: 'telefonos', label: 'Teléfono' },
		{ id: 'sector', label: 'Sector' },
		{ id: 'router', label: 'Router' },
		{ id: 'ipv4', label: 'IPv4' },
		{ id: 'plan', label: 'Plan' },
		{ id: 'fechaPago', label: 'Fecha límite' },
		{ id: 'saldo', label: 'Saldo' },
	];

	return (
		<>
			<IconButton size='small' onClick={handleClick} sx={{ ml: 1 }}>
				<ViewColumnIcon />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				PaperProps={{
					sx: { width: 200, maxHeight: 400 },
				}}
			>
				<Box sx={{ p: 1 }}>
					<Typography variant='subtitle2' sx={{ mb: 1 }}>
						Columnas visibles
					</Typography>
					<Divider sx={{ mb: 1 }} />
					{columns.map((column) => (
						<MenuItem key={column.id} sx={{ py: 0.5 }}>
							<FormControlLabel
								control={
									<Checkbox
										checked={visibleColumns[column.id]}
										onChange={(e) =>
											onColumnVisibilityChange(
												column.id,
												e.target.checked,
											)
										}
										size='small'
									/>
								}
								label={column.label}
								sx={{ width: '100%' }}
							/>
						</MenuItem>
					))}
				</Box>
			</Menu>
		</>
	);
};
