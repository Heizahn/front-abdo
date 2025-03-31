import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Configurar el temporizador para actualizar el valor después del retraso
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Limpiar el temporizador si el valor cambia antes del tiempo de retraso
		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
