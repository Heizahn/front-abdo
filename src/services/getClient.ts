import axios from 'axios';
import { CLIENTS } from '../config/clients';

export async function getClient(str: string, clientList: string) {
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
