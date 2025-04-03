import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import { NotFound } from '../pages/NotFound';
import Login from '../pages/Login';
import ProtectedRouter from './ProtectedRouter';
import ClientDetails from '../pages/ClientDetails';

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Navigate to='/home' />} />
				<Route path='/login' element={<Login />} />
				<Route element={<ProtectedRouter />}>
					<Route path='/home' element={<Dashboard />} />
					<Route path='/clients' element={<Clients />} />
					<Route path='/client/:id' element={<ClientDetails />} />
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
