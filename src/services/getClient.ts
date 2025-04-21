import axios from 'axios';
import { CLIENTS } from '../config/clients';
import { clientSearchSchema, validateData } from '../validations/schemas';

// Definición de tipos para CLIENTS
export type ClientListType = 'ABDO77' | 'Gianni'; // Las claves exactas de tu objeto CLIENTS

// Función para validar que un clientList es válido
export function isValidClientList(clientList: string): clientList is ClientListType {
	return clientList === 'ABDO77' || clientList === 'Gianni';
}

interface ValidationError {
	validationErrors: Record<string, string>;
}

export async function getClient(searchTerm: string, clientList: string) {
	// Validar los datos de entrada
	await validateData(clientSearchSchema, { searchTerm, clientList });

	if (!isValidClientList(clientList)) {
		throw new Error(`Cliente "${clientList}" no encontrado`);
	}

	try {
		const response = await axios.get(
			`${CLIENTS[clientList].url}/clientByIdentity/${searchTerm}`,
		);

		if (!response.data) {
			return [];
		}

		return response.data;
	} catch (error: unknown) {
		if (error && typeof error === 'object' && 'validationErrors' in error) {
			throw error as ValidationError;
		}
		console.error('Error al buscar cliente:', error);
		throw error;
	}
}
