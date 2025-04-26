import { Container } from '@mui/material';
import SearchClient from './viewPayment/searchClient';

export default function Create() {
	return (
		<Container sx={{ p: 3 }}>
			<SearchClient />
		</Container>
	);
}
