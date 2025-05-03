import { useEffect } from 'react';
import {
	FormControl,
	Grid,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { useClientDetailsContext } from '../../../context/ClientDetailContext';
import { SelectList } from '../../../interfaces/types';
import { ClientDetails } from '../../../interfaces/InterfacesClientDetails';

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

		setClientUpdate((prevData: Partial<ClientDetails>) => ({
			...prevData,
			[name]: value,
		}));
	};

	useEffect(() => {
		if (selectList.length > 0) {
			const selectedItem = selectList.find(
				(item) => String(item.id) === String(valueInitial),
			);

			setClientUpdate((prevData: Partial<ClientDetails>) => ({
				...prevData,
				[name]: selectedItem ? selectedItem.id : null,
			}));
		}
	}, []);

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
								clientUpdate[
									name as keyof Partial<ClientDetails>
								]?.toString()) ||
							''
						}
						onChange={handleChange}
						variant='standard'
					>
						{selectList.map((item) => (
							<MenuItem key={item.id} value={item.id}>
								{item.sName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	);
};

export default EditableSelectField;
