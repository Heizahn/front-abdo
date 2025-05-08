import {
	CircularProgress,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import { useFetchData } from '../../../hooks/useQuery';
import { SelectList } from '../../../interfaces/types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type ProveedorProps = {
	handleClientChange: (e: string) => void;
};

export default function Proveedor({ handleClientChange }: ProveedorProps) {
	const [selectedValue, setSelectedValue] = useState<string>('');
	const { data: clientList, isLoading } = useFetchData<SelectList[]>(
		'/users/providers',
		'providers',
	);
	const location = useLocation();

	useEffect(() => {
		// Extraer el ID del proveedor de la URL
		const searchParams = new URLSearchParams(location.search);
		const proveedorId = searchParams.get('provider');

		// Si hay un ID de proveedor en la URL y tenemos la lista de proveedores
		if (proveedorId && clientList?.length) {
			// Verificar si el ID existe en la lista de proveedores
			const proveedorExiste = clientList.some((client) => client.id === proveedorId);

			if (proveedorExiste) {
				setSelectedValue(proveedorId);
				handleClientChange(proveedorId);
			}
		}
	}, [clientList, location.search, handleClientChange, isLoading]);

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
