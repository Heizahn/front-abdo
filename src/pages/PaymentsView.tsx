import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Box } from '@mui/material';
import Navigation from '../components/Payments/Navigation';
import Create from '../components/Payments/Create';
import TableLastPay from '../components/Payments/TableLastPay';
import { useFetchData } from '../hooks/useQuery';

// Definimos la interfaz Pago
interface Pago {
	_id: string;
	cliente: string;
	tipoPago: string;
	fecha: string;
	creadoPor: string;
	montoUSD: number;
	montoVES: number;
	referencia: string;
	comentario: string;
	estado: 'Activo' | 'Anulado';
	recibidoPor: string;
	motivo: string;
}

export default function PaymentsView() {
	const [activeTab, setActiveTab] = useState('create');

	// Precargamos los datos simples cuando se carga el componente
	const { data: pagosSimpleData = [], isLoading: isLoadingSimple } = useFetchData<Pago[]>(
		'/paysListSimple',
		'paysListSimple',
	);

	// Renderizamos el contenido activo según la pestaña seleccionada
	const renderTabContent = () => {
		switch (activeTab) {
			case 'create':
				return <Create />;
			case 'payments':
				// Pasamos los datos precargados y el estado de carga al componente hijo
				return (
					<TableLastPay
						pagosSimpleData={pagosSimpleData}
						isLoadingSimple={isLoadingSimple}
					/>
				);
			default:
				return <Create />;
		}
	};

	// Opcionalmente, podemos precargar los datos cuando el usuario cambia a la pestaña de payments
	useEffect(() => {
		if (activeTab === 'payments') {
			// Aquí podemos hacer alguna precarga adicional si es necesario
		}
	}, [activeTab]);

	return (
		<MainLayout title='Pagos'>
			<Box
				sx={{
					bgcolor: 'background.paper',
					pt: 1,
					borderRadius: 2,
					boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Navigation activeTab={activeTab} onTabChange={setActiveTab} />
				{renderTabContent()}
			</Box>
		</MainLayout>
	);
}
