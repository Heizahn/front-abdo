import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import { NotFound } from '../pages/NotFound';
import Login from '../pages/Login';
import ProtectedRouter from './ProtectedRouter';
import ClientDetails from '../pages/ClientDetails';
import PaymentsView from '../pages/PaymentsView';
import ServicesView from '../pages/ServicesView';

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Navigate to='/home' replace />} />
				<Route path='/login' element={<Login />} />
				<Route element={<ProtectedRouter />}>
					<Route path='/home' element={<Dashboard />} />
					<Route path='/clients' element={<Clients />} />
					<Route path='/client/:id' element={<ClientDetails />} />
					<Route path='/payments' element={<PaymentsView />} />
					<Route path='/services' element={<ServicesView />} />
					<Route path='*' element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
