import axios from 'axios';

export const getClientById = async (id: string) => {
	console.log(id);
	const { data } = await axios.get(`/client/${id}`);

	console.log('client', data);

	return data[0];
};
