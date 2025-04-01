import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NotificationContextType, NotificationInfo } from '../interfaces/types';
import NotificationAlert from '../components/notifications/notify';
import { AlertColor } from '@mui/material';

// Crear el contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Proveedor del contexto
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [notification, setNotification] = useState<NotificationInfo>({
		open: false,
		message: '',
		severity: 'info',
	});

	const showNotification = (
		message: string,
		severity: AlertColor = 'info',
		title?: string,
		duration?: number,
		position?: {
			vertical: 'top' | 'bottom';
			horizontal: 'left' | 'center' | 'right';
		},
	) => {
		setNotification({
			open: true,
			title,
			message,
			severity,
			autoHideDuration: duration,
			position,
		});
	};

	const hideNotification = () => {
		setNotification((prev) => ({ ...prev, open: false }));
	};

	// Métodos de acceso rápido para cada tipo de notificación
	const notifySuccess = (message: string, title?: string) =>
		showNotification(message, 'success', title || 'Éxito');

	const notifyError = (message: string, title?: string) =>
		showNotification(message, 'error', title || 'Error');

	const notifyWarning = (message: string, title?: string) =>
		showNotification(message, 'warning', title || 'Advertencia');

	const notifyInfo = (message: string, title?: string) =>
		showNotification(message, 'info', title || 'Información');

	return (
		<NotificationContext.Provider
			value={{
				showNotification,
				hideNotification,
				notifySuccess,
				notifyError,
				notifyWarning,
				notifyInfo,
			}}
		>
			{children}
			<NotificationAlert
				open={notification.open}
				onClose={hideNotification}
				title={notification.title}
				message={notification.message}
				severity={notification.severity}
				autoHideDuration={notification.autoHideDuration}
				position={notification.position}
			/>
		</NotificationContext.Provider>
	);
};

// Hook personalizado para usar el contexto
export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
	}
	return context;
};
