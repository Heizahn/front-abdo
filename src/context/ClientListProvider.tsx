import { ClientListContext } from './ClientListContext';
import { CLIENTS } from '../config/clients';
import { useState } from 'react';

// Provider component
export const ClientListProvider = ({ children }) => {
	// Value to be provided by the context
	const [clientList, setClientList] = useState(CLIENTS.ABDO77.name);

	const handleClientChange = (client) => {
		setClientList(client);
	};

	return (
		<ClientListContext.Provider value={{ clientList, handleClientChange }}>
			{children}
		</ClientListContext.Provider>
	);
};
