import { useCallback } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';

export const useBuildParams = () => {
	const { user } = useAuth();

	const buildParams = useCallback(() => {
		switch (user?.nRole) {
			case ROLES.PROVIDER:
				return '?idOwner=' + user?.id;
			default:
				return '';
		}
	}, [user]);

	return buildParams();
};
