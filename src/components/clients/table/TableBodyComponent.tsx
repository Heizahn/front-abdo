import React from 'react';
import { Table } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Client } from '../../../interfaces/Interfaces';
import { TableBodyRowComponent } from './TableBodyRowComponent';

interface TableBodyProps {
	table: Table<Client>;
	tableContainerRef: React.RefObject<HTMLDivElement>;
}

export function TableBodyComponent({ table, tableContainerRef }: TableBodyProps) {
	const { rows } = table.getRowModel();

	// Configuración del virtualizador
	const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
		count: rows.length,
		estimateSize: () => 35,
		getScrollElement: () => tableContainerRef.current,
		measureElement: (element) => element?.getBoundingClientRect().height,
		overscan: 20,
		initialOffset: 0,
		scrollToFn: (offset, canSmooth) => {
			if (tableContainerRef.current) {
				tableContainerRef.current.scrollTo({
					top: offset,
					behavior: canSmooth ? 'smooth' : 'auto',
				});
			}
		},
	});

	// Calcular el ancho total de la tabla
	const totalWidth = table
		.getAllColumns()
		.reduce((acc, column) => acc + column.getSize(), 0);

	return (
		<tbody
			style={{
				position: 'relative',
				width: '100%',
				height: `${rowVirtualizer.getTotalSize()}px`,
				display: 'block',
			}}
		>
			{rowVirtualizer.getVirtualItems().map((virtualRow) => {
				const row = rows[virtualRow.index];
				return (
					<TableBodyRowComponent
						key={row.id}
						row={row}
						virtualRow={virtualRow}
						rowVirtualizer={rowVirtualizer}
						totalWidth={totalWidth}
					/>
				);
			})}
		</tbody>
	);
}
