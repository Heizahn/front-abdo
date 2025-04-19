// ClientListProvider.tsx
import React, { ReactNode, useState } from 'react';
import ClientListContext from './ClientListContext';

// Define el tipo para los props del provider
interface ClientListProviderProps {
	children: ReactNode;
}

export const ClientListProvider: React.FC<ClientListProviderProps> = ({ children }) => {
	const [clientList, setClientList] = useState('ABDO77');

	// Corrige el tipo del parámetro
	const handleClientChange = (client: string) => {
		setClientList(client);
	};

	return (
		<ClientListContext.Provider value={{ clientList, handleClientChange }}>
			{children}
		</ClientListContext.Provider>
	);
};
