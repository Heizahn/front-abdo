import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import { NotFound } from '../pages/NotFound';

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Navigate to='/home' />} />
				<Route path='/home' element={<Dashboard />} />
				<Route path='/clients' element={<Clients />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
