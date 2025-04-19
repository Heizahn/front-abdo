import { createContext } from 'react';

interface ClientListContextType {
	clientList: string;
	// Corregir el tipo de handleClientChange para no usar e como parámetro
	// sino directamente el nombre del cliente
	handleClientChange: (client: string) => void;
}

// Create the context
const ClientListContext = createContext<ClientListContextType>({
	clientList: 'ABDO77', // Valor inicial por defecto
	handleClientChange: () => {}, // Función de cambio de cliente
});

export default ClientListContext;
