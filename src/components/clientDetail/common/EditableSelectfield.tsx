import { useEffect } from 'react';
import {
	FormControl,
	Grid,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import {
	ClientUpdateType,
	useClientDetailsContext,
} from '../../../context/ClientDetailContext';
import { SelectList } from '../../../interfaces/types';

interface EditableInfoFieldProps {
	label: string;
	valueInitial: string | number | boolean;
	name: string;
	selectList: SelectList[];
}

const EditableSelectField = ({
	label,
	valueInitial,
	name,
	selectList,
}: EditableInfoFieldProps) => {
	const { setClientUpdate, clientUpdate } = useClientDetailsContext();

	const handleChange = (e: SelectChangeEvent) => {
		const { name, value } = e.target;

		setClientUpdate((prevData: ClientUpdateType) => ({
			...prevData,
			[name]: value,
		}));
	};

	useEffect(() => {
		if (selectList.length > 0) {
			setClientUpdate((prevData: ClientUpdateType) => ({
				...prevData,
				[name]: selectList.filter((item) => item.nombre === valueInitial)[0]._id,
			}));
		}
	}, [name, selectList, setClientUpdate, valueInitial]);

	return (
		<Grid container spacing={1} sx={{ mb: 2 }}>
			<Grid item xs={5} md={4} sx={{ textAlign: 'right' }}>
				<Typography variant='body2' color='textSecondary' sx={{ pt: 1 }}>
					{label}:
				</Typography>
			</Grid>
			<Grid item xs={4} md={6}>
				<FormControl fullWidth margin='dense'>
					<Select
						id={name}
						name={name}
						value={
							(clientUpdate &&
								clientUpdate[name as keyof ClientUpdateType]?.toString()) ||
							''
						}
						onChange={handleChange}
						variant='standard'
					>
						{selectList.map((item) => (
							<MenuItem key={item._id} value={item._id}>
								{item.nombre}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default EditableSelectField;
