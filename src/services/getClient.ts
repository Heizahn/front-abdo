import axios from 'axios';
import { CLIENTS } from '../config/clients';
// Definición de tipos para CLIENTS
export type ClientListType = 'ABDO77' | 'Gianni'; // Las claves exactas de tu objeto CLIENTS

// Función para validar que un clientList es válido
export function isValidClientList(clientList: string): clientList is ClientListType {
	return clientList === 'ABDO77' || clientList === 'Gianni';
}

export async function getClient(str: string, clientList: string) {
	if (!isValidClientList(clientList)) {
		throw new Error(`Cliente "${clientList}" no encontrado`);
	}
	try {
		const response = await axios.get(`${CLIENTS[clientList].url}/clientByIdentity/${str}`);

		if (!response.data) {
			return [];
		}

		return response.data;
	} catch (error) {
		console.error('Error al buscar cliente:', error);
		throw error;
	}
}
