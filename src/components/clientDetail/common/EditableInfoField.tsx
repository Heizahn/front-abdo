import { ChangeEvent, useEffect } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import {
	ClientUpdateType,
	useClientDetailsContext,
} from '../../../context/ClientDetailContext';

interface EditableInfoFieldProps {
	label: string;
	valueInitial: string | number | boolean;
	name: string;
	type?: 'text' | 'email' | 'number';
}

const EditableInfoField = ({
	label,
	valueInitial,
	name,
	type = 'text',
}: EditableInfoFieldProps) => {
	const { setClientUpdate, clientUpdate } = useClientDetailsContext();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setClientUpdate((prevData: ClientUpdateType) => ({
			...prevData,
			[name]: value,
		}));
	};

	useEffect(() => {
		setClientUpdate((prevData: ClientUpdateType) => ({
			...prevData,
			[name]: valueInitial,
		}));
	}, [name, setClientUpdate, valueInitial]);

	const currentValue = clientUpdate
		? name in clientUpdate
			? (clientUpdate as ClientUpdateType)[name as keyof ClientUpdateType]
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
