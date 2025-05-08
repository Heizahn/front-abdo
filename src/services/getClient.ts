import axios from 'axios';
import { clientSearchSchema, validateData } from '../validations/schemas';
import { HOST_API } from '../config/env';

export async function getClient(searchTerm: string, buildParams: string) {
	await validateData(clientSearchSchema, { searchTerm });
	try {
		const response = await axios.get(
			`${HOST_API}/clients/search/${searchTerm}${buildParams}`,
		);

		if (!response.data) {
			return [];
		}

		return response.data;
	} catch (error: unknown) {
		console.error('Error al buscar cliente:', error);
		throw error;
	}
}
