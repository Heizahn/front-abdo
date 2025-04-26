import React from 'react';
import { TableRowProps } from '@mui/material';
import { StyledTableRow } from '../clients/table/styles';

interface TableRowClickHandlerProps extends TableRowProps {
	onRowClick: () => void;
}

export const TableRowClickHandler: React.FC<TableRowClickHandlerProps> = ({
	onRowClick,
	children,
	...props
}) => {
	const handleClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
		// Verificar si hay texto seleccionado
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0) {
			return; // Si hay texto seleccionado, no hacer nada
		}

		// Verificar si el clic fue en un elemento interactivo
		const target = event.target as HTMLElement;
		if (target.closest('button') || target.closest('a') || target.closest('input')) {
			return; // Si el clic fue en un elemento interactivo, no hacer nada
		}

		onRowClick();
	};

	return (
		<StyledTableRow {...props} onClick={handleClick}>
			{children}
		</StyledTableRow>
	);
};
