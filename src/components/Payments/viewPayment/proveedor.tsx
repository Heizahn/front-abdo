import {
	CircularProgress,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import { useFetchData } from '../../../hooks/useQuery';
import { SelectList } from '../../../interfaces/types';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
	const navigate = useNavigate();

	// Memoizar la función para evitar ejecuciones innecesarias
	const updateUrlWithProvider = useCallback(
		(providerId: string) => {
			// Crear una nueva instancia de URLSearchParams para evitar mutaciones
			const searchParams = new URLSearchParams(location.search);
			const currentProviderId = searchParams.get('provider');

			// Solo actualizar si el valor ha cambiado
			if (currentProviderId !== providerId) {
				if (providerId) {
					searchParams.set('provider', providerId);
				} else {
					searchParams.delete('provider');
				}

				// Construir la URL completa
				const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

				navigate(newUrl, { replace: true });
			}
		},
		[location.search, navigate],
	);

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

	// Manejar el cambio del select
	const handleSelectChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;

		// Actualizar el estado local
		setSelectedValue(value);

		// Notificar al componente padre
		handleClientChange(value);

		// Actualizar la URL (solo este componente lo hace)
		updateUrlWithProvider(value);
	};

	if (isLoading) return <CircularProgress size={20} />;

	if (!clientList && !isLoading) return null;

	if (clientList && !isLoading)
		return (
			<FormControl sx={{ minWidth: 160, mr: 2 }} size='small'>
				<Select
					value={selectedValue}
					onChange={handleSelectChange}
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
