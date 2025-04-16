import { createContext } from 'react';
import { CLIENTS } from '../config/clients';

// Create the context
export const ClientListContext = createContext({
	clientList: CLIENTS.ABDO77.name,
	handleClientChange: (e: string) => {},
});
