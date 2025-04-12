// src/context/ClientDetailContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { ClientDetails } from '../interfaces/InterfacesClientDetails';

import { useParams } from 'react-router-dom';
import { useFetchData, useMutateDate } from '../hooks/useQuery';
import axios from 'axios';
import { HOST_API } from '../config/env';
import { useNotification } from './NotificationContext';
import { Subscription } from '../interfaces/types';
import { queryClient } from '../query-client';
import authService from '../services/authServices';

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
	client: ClientDetails | null;
	clientUpdate: ClientUpdateType | null;
	loading: boolean;
	error: Error | null;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	setClientUpdate: (clientUpdate: ClientUpdateType | null) => void;
	updateClient: () => void;
}

// Crear el contexto con valores iniciales
const ClientContext = createContext<ClientContextType>({
	client: null,
	clientUpdate: null,
	loading: true,
	error: null,
	isEditing: false,
	setIsEditing: () => {},
	setClientUpdate: () => {},
	updateClient: () => {},
});

export const ClientDetailsProvider = ({ children }: { children: ReactNode }) => {
	const { id } = useParams();
	const [isEditing, setIsEditing] = useState(false);
	const [clientUpdate, setClientUpdate] = useState<ClientUpdateType | null>(null);
	const { notifySuccess, notifyError } = useNotification();

	const queryKeys = [`client-${id}`];

	const mutationSus = useMutateDate<
		{
			fecha: string;
			creadoPor: string;
			planesId: string;
			clientesId: string;
		},
		Subscription
	>('/suscripciones', {
		onSuccess: () => {
			notifySuccess('Cliente actualizado correctamente', 'Cliente actualizado');
			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});
		},
		onError: (err) => {
			if (err instanceof Error) {
				notifyError(err.message, 'Error al agregar el plan');
			}
		},
	});
	const updateClient = async () => {
		try {
			console.log('updateClient');
			console.log(clientUpdate);

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
				});
			} else {
				throw new Error('No hay datos para actualizar');
			}

			await mutationSus.mutateAsync({
				clientesId: id as string,
				planesId: clientUpdate.planesId,
				fecha: new Date().toISOString(),
				creadoPor: (await authService.profile()).id,
			});

			setIsEditing(false);
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al actualizar el cliente');
			}
		}
	};

	const {
		data,
		isLoading: loading,
		error,
	} = useFetchData<ClientDetails[]>(`/client/${id}`, `client-${id}`, {
		gcTime: 30000,
	});

	if (data) {
		const client = data[0];

		return (
			<ClientContext.Provider
				value={{
					clientUpdate,
					client,
					loading,
					error,
					isEditing,
					setIsEditing,
					setClientUpdate,
					updateClient,
				}}
			>
				{children}
			</ClientContext.Provider>
		);
	}
};

export const useClientDetailsContext = () => useContext(ClientContext);
