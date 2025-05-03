// src/context/ClientDetailContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { HOST_API } from '../config/env';
import { useNotification } from './NotificationContext';
import { queryClient } from '../query-client';
import { useFetchData } from '../hooks/useQuery';
import { ClientDetails, Pago } from '../interfaces/InterfacesClientDetails';
import { useAuth } from './AuthContext';

// Definir la interfaz del contexto
interface ClientContextType {
	clientUpdate: Partial<ClientDetails>;
	client: ClientDetails | null;
	isEditing: boolean;
	setIsEditing: (isEditing: boolean) => void;
	setClientUpdate: React.Dispatch<React.SetStateAction<Partial<ClientDetails>>>;
	updateClient: () => void;
	error: Error | null;
	isClientLoading: boolean;
	payments: Pago[];
	uploadPayments: (payments: Pago[]) => void;
}

// Crear el contexto con valores iniciales
const ClientContext = createContext<ClientContextType>({
	clientUpdate: {
		sName: '',
		sDni: '',
		sRif: '',
		sPhone: '',
		sAddress: '',
		sType: '',
		sMac: '',
		sSn: '',
		sIp: '',
		sCommentary: '',
		idSector: '',
		idSubscription: '',
		idEditor: '',
		dEdition: '',
		nPayment: 0,
	},
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
	const [clientUpdate, setClientUpdate] = useState<Partial<ClientDetails>>({
		sName: '',
		sDni: '',
		sRif: '',
		sPhone: '',
		sAddress: '',
		sType: '',
		sMac: '',
		sSn: '',
		sIp: '',
		sCommentary: '',
		idSector: '',
		idSubscription: '',
		dEdition: '',
		idEditor: '',
		nPayment: 0,
	});
	const [originalClient, setOriginalClient] = useState<Partial<ClientDetails> | null>(null);
	const [payments, setPayments] = useState<Pago[]>([]);
	const { notifySuccess, notifyError, notifyWarning } = useNotification();
	const { user } = useAuth();

	const queryKeys = [`client-${id}`, 'clients'];

	const updateClient = async () => {
		try {
			if (!clientUpdate || !originalClient) {
				throw new Error('No hay datos para actualizar');
			}

			// Crear objeto con solo las propiedades que han cambiado
			const changedProperties: Partial<ClientDetails> = {};
			let hasChanges = false;

			// Solo comparamos las propiedades que están presentes en ambos objetos
			Object.keys(originalClient).forEach((key) => {
				const typedKey = key as keyof Partial<ClientDetails>;
				const currentValue = clientUpdate[typedKey];
				const originalValue = originalClient[typedKey];

				// Solo comparamos si ambos valores existen
				if (currentValue !== undefined && originalValue !== undefined) {
					if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
						(changedProperties as Record<string, string | number>)[typedKey] =
							currentValue;
						hasChanges = true;
					}
				}
			});

			// Si no hay cambios, no hacer la petición
			if (!hasChanges) {
				notifyWarning('No hay cambios para actualizar', 'Sin cambios');
				return;
			}

			// Agregar información de edición
			const finalUpdate = {
				...changedProperties,
				idEditor: user?.id,
				dEdition: new Date().toISOString(),
			};

			console.log('Enviando actualización:', finalUpdate);
			await axios.patch(`${HOST_API}/clients/${id}`, finalUpdate);

			queryKeys.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
					predicate: (query) => query.queryKey.includes(key),
				});
			});

			notifySuccess('Cliente actualizado correctamente', 'Cliente actualizado');
			setIsEditing(false);
		} catch (error) {
			if (error instanceof Error) {
				notifyError(error.message, 'Error al actualizar el cliente');
			}
		}
	};

	const {
		data: client,
		isLoading: isClientLoading,
		error,
	} = useFetchData<ClientDetails>(`/clients/${id}/details`, 'client-' + id);

	// Actualizar el cliente original cuando se carga
	useEffect(() => {
		if (client) {
			// Solo inicializamos con los campos que realmente necesitamos para editar
			const initialClientData: Partial<ClientDetails> = {
				sName: client.sName,
				sDni: client.sDni,
				sRif: client.sRif,
				sPhone: client.sPhone,
				sAddress: client.sAddress,
				sType: client.sType,
				sMac: client.sMac,
				sSn: client.sSn,
				sIp: client.sIp,
				sGps: client.sGps,
				sCommentary: client.sCommentary,
				idSector: client.idSector,
				idSubscription: client.idSubscription,
				nPayment: client.nPayment,
				sState: client.sState,
			};
			setOriginalClient(initialClientData);
			setClientUpdate(initialClientData);
		}
	}, [client]);

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
