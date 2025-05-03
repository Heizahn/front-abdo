import { ChangeEvent, useEffect } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';

interface EditableInfoFieldProps {
	label: string;
	valueInitial: string | number | boolean;
	name: string;
	type?: 'text' | 'email' | 'number';
	multiline?: boolean;
}

const EditableInfoField = ({
	label,
	valueInitial,
	name,
	type = 'text',
	multiline = false,
}: EditableInfoFieldProps) => {
	const { setClientUpdate, clientUpdate } = useClientDetailsContext();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setClientUpdate((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	useEffect(() => {
		setClientUpdate((prevData) => ({
			...prevData,
			[name]: valueInitial,
		}));
	}, []);

	const currentValue = clientUpdate
		? name in clientUpdate
			? (clientUpdate as Partial<ClientDetails>)[name as keyof Partial<ClientDetails>]
			: valueInitial
		: valueInitial;

	return (
		<Grid container spacing={1} sx={{ mb: 2 }}>
			<Grid item xs={5} md={4} sx={{ textAlign: 'right' }}>
				<Typography variant='body2' color='textSecondary' sx={{ pt: 1 }}>
					{label}:
				</Typography>
			</Grid>
			<Grid item xs={4} md={6}>
				<TextField
					fullWidth // Added for consistency with select field
					size='small'
					multiline={multiline}
					type={type}
					name={name}
					value={currentValue}
					onChange={handleChange}
					variant='standard'
				/>
			</Grid>
		</Grid>
	);
};

export default EditableInfoField;
