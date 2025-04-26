import React, { memo } from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { VirtualItem, Virtualizer } from '@tanstack/react-virtual';
import { Client } from '../../../interfaces/Interfaces';
import { useNavigate } from 'react-router-dom';
import { TableRowClickHandler } from '../../common/TableRowClickHandler';

interface TableBodyRowProps {
	row: Row<Client>;
	virtualRow: VirtualItem;
	rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
	totalWidth: number;
}

// Usar memo para evitar re-renders innecesarios
export const TableBodyRowComponent = memo(function TableBodyRowComponent({
	row,
	virtualRow,
	rowVirtualizer,
	totalWidth,
}: TableBodyRowProps) {
	const navigate = useNavigate();

	const handleNavigate = (clientId: string) => {
		navigate(`/client/${clientId}`);
	};

	// Calcular el estilo de la fila una sola vez
	const rowStyle = {
		position: 'absolute',
		top: 0,
		left: 0,
		width: `${totalWidth}px`,
		transform: `translateY(${virtualRow.start}px)`,
		display: 'flex',
		cursor: 'pointer',
		backgroundColor: virtualRow.index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
		borderLeft:
			row.original.saldo < 0 && row.original.estado === 'Activo'
				? '4px solid #ed6c02'
				: row.original.estado === 'Activo' && row.original.saldo >= 0
				? '4px solid #2e7d32'
				: row.original.estado === 'Suspendido'
				? '4px solid #d32f2f'
				: '4px solid #b0b0b0',
		borderBottom: '1px solid #e0e0e0',
		transition: 'background-color 0.3s ease',
		'&:hover': {
			backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
		},
		zIndex: 1,
	};

	return (
		<TableRowClickHandler
			data-index={virtualRow.index}
			ref={(node) => rowVirtualizer.measureElement(node)}
			key={row.id}
			onRowClick={() => handleNavigate(row.original.id)}
			sx={rowStyle}
		>
			{row.getVisibleCells().map((cell) => {
				const columnSize = cell.column.getSize();
				return (
					<td
						key={cell.id}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-start',
							width: `${columnSize}px`,
							minWidth: `${columnSize}px`,
							fontSize: '0.8rem',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							boxSizing: 'border-box',
							padding: '8px 4px',
						}}
					>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</td>
				);
			})}
		</TableRowClickHandler>
	);
});
