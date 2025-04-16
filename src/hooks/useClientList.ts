import { useContext } from 'react';
import { ClientListContext } from '../context/ClientListContext';

// Custom hook for using the client list context
export const useClientList = () => {
	const context = useContext(ClientListContext);

	if (context === undefined) {
		throw new Error('useClientList must be used within a ClientListProvider');
	}

	return context;
};
