// src/context/ClientDetailContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { HOST_API } from '../config/env';
import { useNotification } from './NotificationContext';
import { queryClient } from '../query-client';
import { useFetchData } from '../hooks/useQuery';
import { ClientDetails, Pago } from '../interfaces/InterfacesClientDetails';

export interface ClientUpdateType {
	nombre: string;
	identificacion: string;
	telefonos: string;
	direccion: string;
	email: string;
	sectoresId: string;
	coordenadas: string;
	planesId: string;
	ipv4: string;
	routersId: string;
	fechaPago: number;
}

// Definir la interfaz del contexto
interface ClientContextType {
	clientUpdate: ClientUpdateType | null;
	client: ClientDetails | null;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	setClientUpdate: React.Dispatch<React.SetStateAction<ClientUpdateType>>;
	updateClient: () => void;
	error: Error | null;
	isClientLoading: boolean;
	payments: Pago[];
	uploadPayments: (payments: Pago[]) => void;
}

// Crear el contexto con valores iniciales
const ClientContext = createContext<ClientContextType>({
	clientUpdate: null,
	client: null,
	isEditing: false,
	setIsEditing: () => {},
	setClientUpdate: () => {},
	updateClient: () => {},
	error: null,
	isClientLoading: false,
	payments: [],
	uploadPayments: () => {},
});

export const ClientDetailsProvider = ({ children }: { children: ReactNode }) => {
	const { id } = useParams();
	const [isEditing, setIsEditing] = useState(false);
	const [clientUpdate, setClientUpdate] = useState<ClientUpdateType>({
		nombre: '',
		identificacion: '',
		telefonos: '',
		direccion: '',
		email: '',
		sectoresId: '',
		coordenadas: '',
		planesId: '',
		ipv4: '',
		routersId: '',
		fechaPago: 0,
	});
	const [payments, setPayments] = useState<Pago[]>([]);
	const { notifySuccess, notifyError } = useNotification();

	const queryKeys = [`client-${id}`, 'all-clients'];

	const updateClient = async () => {
		try {
			if (clientUpdate) {
				await axios.patch(`${HOST_API}/clientes/${id}`, {
					nombre: clientUpdate.nombre,
					identificacion: clientUpdate.identificacion,
					telefonos: clientUpdate.telefonos,
					direccion: clientUpdate.direccion,
					email: clientUpdate.email,
					sectoresId: clientUpdate.sectoresId,
					coordenadas: clientUpdate.coordenadas,
					ipv4: clientUpdate.ipv4,
					routersId: clientUpdate.routersId,
					subscription: clientUpdate.planesId,
				});
			} else {
				throw new Error('No hay datos para actualizar');
			}

			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});

			notifySuccess('Cliente actualizado correctamente', 'Cliente actualizado');
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al actualizar el cliente');
			}
		} finally {
			setIsEditing(false);
		}
	};

	const {
		data: client,
		isLoading: isClientLoading,
		error,
	} = useFetchData<ClientDetails>(`/client/${id}/details`, 'client-' + id);

	const uploadPayments = (payments: Pago[]) => {
		setPayments(payments);
	};
	return (
		<ClientContext.Provider
			value={{
				clientUpdate,
				isEditing,
				client: client ?? null,
				setIsEditing,
				setClientUpdate,
				updateClient,
				error,
				isClientLoading,
				payments,
				uploadPayments,
			}}
		>
			{children}
		</ClientContext.Provider>
	);
};

export const useClientDetailsContext = () => useContext(ClientContext);
