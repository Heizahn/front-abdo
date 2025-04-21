import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRouter, { ROLES } from "./ProtectedRouter";
import DefaultRedirect from "./DefaultRedirect";
import LoadingScreen from "../components/LoadingScreen";
import ErrorBoundary from "../components/ErrorBoundary";

// Lazy loading de las páginas con manejo de errores
const lazyLoad = (importPromise: Promise<any>) => {
	return lazy(() =>
		importPromise.catch((error) => ({
			default: () => {
				throw error;
			},
		}))
	);
};

// Lazy loading de las páginas
const Dashboard = lazyLoad(import("../pages/Dashboard"));
const Clients = lazyLoad(import("../pages/Clients"));
const NotFound = lazyLoad(import("../pages/NotFound"));
const Login = lazyLoad(import("../pages/Login"));
const ClientDetails = lazyLoad(import("../pages/ClientDetails"));
const PaymentsView = lazyLoad(import("../pages/PaymentsView"));
const ServicesView = lazyLoad(import("../pages/ServicesView"));
const SectorsView = lazyLoad(import("../pages/SectorView"));
const RoutersView = lazyLoad(import("../pages/RoutersView"));
const RouterView = lazyLoad(import("../pages/RouterView"));

export default function Router() {
	return (
		<BrowserRouter>
			<ErrorBoundary>
				<Suspense fallback={<LoadingScreen />}>
					<Routes>
						<Route path="/" element={<DefaultRedirect />} />
						<Route path="/login" element={<Login />} />
						<Route element={<ProtectedRouter />}>
							<Route
								element={
									<ProtectedRouter
										requiredRoles={[
											ROLES.ADMIN,
											ROLES.SUPERADMIN,
										]}
									/>
								}
							>
								<Route path="/clients" element={<Clients />} />
								<Route
									path="/client/:id"
									element={<ClientDetails />}
								/>
							</Route>

							<Route
								path="/payments"
								element={<PaymentsView />}
							/>

							<Route
								element={
									<ProtectedRouter
										requiredRoles={[ROLES.SUPERADMIN]}
									/>
								}
							>
								<Route path="/home" element={<Dashboard />} />
								<Route
									path="/services"
									element={<ServicesView />}
								/>
								<Route
									path="/sectors"
									element={<SectorsView />}
								/>
								<Route
									path="/routers"
									element={<RoutersView />}
								/>
								<Route
									path="/router/:id"
									element={<RouterView />}
								/>
							</Route>
							<Route path="*" element={<NotFound />} />
						</Route>
					</Routes>
				</Suspense>
			</ErrorBoundary>
		</BrowserRouter>
	);
}
