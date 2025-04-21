import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRouter, { ROLES } from './ProtectedRouter';
import DefaultRedirect from './DefaultRedirect';
import LoadingScreen from '../components/LoadingScreen';

// Lazy loading de las páginas
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Clients = lazy(() => import('../pages/Clients'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));
const ClientDetails = lazy(() => import('../pages/ClientDetails'));
const PaymentsView = lazy(() => import('../pages/PaymentsView'));
const ServicesView = lazy(() => import('../pages/ServicesView'));
const SectorsView = lazy(() => import('../pages/SectorView'));
const RoutersView = lazy(() => import('../pages/RoutersView'));
const RouterView = lazy(() => import('../pages/RouterView'));



export default function Router() {
	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingScreen />}>
				<Routes>
					<Route path='/' element={<DefaultRedirect />} />
					<Route path='/login' element={<Login />} />
					<Route element={<ProtectedRouter />}>
						<Route
							element={
								<ProtectedRouter requiredRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]} />
							}
						>
							<Route path='/clients' element={<Clients />} />
							<Route path='/client/:id' element={<ClientDetails />} />
						</Route>

						<Route path='/payments' element={<PaymentsView />} />

						<Route element={<ProtectedRouter requiredRoles={[ROLES.SUPERADMIN]} />}>
							<Route path='/home' element={<Dashboard />} />
							<Route path='/services' element={<ServicesView />} />
							<Route path='/sectors' element={<SectorsView />} />
							<Route path='/routers' element={<RoutersView />} />
							<Route path='/router/:id' element={<RouterView />} />
						</Route>
						<Route path='*' element={<NotFound />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}
