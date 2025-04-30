import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRouter, { ROLES } from './ProtectedRouter';
import DefaultRedirect from './DefaultRedirect';
import ErrorBoundary from '../components/ErrorBoundary';

// Importaciones directas de las páginas
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import ClientDetails from '../pages/ClientDetails';
import PaymentsView from '../pages/PaymentsView';
import ServicesView from '../pages/ServicesView';
import SectorsView from '../pages/SectorView';
// import RoutersView from '../pages/RoutersView';
// import RouterView from '../pages/RouterView';

export default function Router() {
	return (
		<BrowserRouter>
			<ErrorBoundary>
				<Routes>
					<Route path='/' element={<DefaultRedirect />} />
					<Route path='/login' element={<Login />} />
					<Route element={<ProtectedRouter />}>
						<Route
							element={
								<ProtectedRouter
									requiredRoles={[ROLES.ACCOUNTANT, ROLES.SUPERADMIN]}
								/>
							}
						>
							<Route path='/clients' element={<Clients />} />
							<Route path='/client/:id' element={<ClientDetails />} />
						</Route>

						<Route path='/payments' element={<PaymentsView />} />

						<Route
							element={<ProtectedRouter requiredRoles={[ROLES.SUPERADMIN]} />}
						>
							<Route path='/home' element={<Dashboard />} />
							<Route path='/services' element={<ServicesView />} />
							<Route path='/sectors' element={<SectorsView />} />
							{/* <Route path='/routers' element={<RoutersView />} /> */}
							{/* <Route path='/router/:id' element={<RouterView />} /> */}
						</Route>
						<Route path='*' element={<NotFound />} />
					</Route>
				</Routes>
			</ErrorBoundary>
		</BrowserRouter>
	);
}
