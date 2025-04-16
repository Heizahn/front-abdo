import { Container } from '@mui/material';
import SearchClient from './viewPayment/searchClient';
import { ClientListProvider } from '../../context/ClientListProvider';

export default function Create() {
	return (
		<ClientListProvider>
			<Container sx={{ p: 3 }}>
				<SearchClient />
			</Container>
		</ClientListProvider>
	);
}
