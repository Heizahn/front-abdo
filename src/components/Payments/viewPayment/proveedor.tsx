import {
	CircularProgress,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import { useFetchData } from '../../../hooks/useQuery';
import { SelectList } from '../../../interfaces/types';
import { useState } from 'react';

type ProveedorProps = {
	handleClientChange: (e: string) => void;
};

export default function Proveedor({ handleClientChange }: ProveedorProps) {
	const [selectedValue, setSelectedValue] = useState<string>('');
	const { data: clientList, isLoading } = useFetchData<SelectList[]>(
		'/providers',
		'providers',
	);

	if (isLoading) return <CircularProgress size={20} />;

	if (!clientList && !isLoading) return null;

	if (clientList && !isLoading)
		return (
			<FormControl sx={{ minWidth: 160, mr: 2 }} size='small'>
				<Select
					value={selectedValue}
					onChange={(event: SelectChangeEvent<string>) => {
						const value = event.target.value;
						setSelectedValue(value);
						handleClientChange(value);
					}}
					sx={{
						borderRadius: 1,
						'& .MuiSelect-icon': { color: 'white' },
					}}
					displayEmpty
				>
					<MenuItem value='' disabled>
						Selecciona...
					</MenuItem>
					{clientList.map((client) => (
						<MenuItem key={client.id} value={client.id}>
							{client.tag}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
}
