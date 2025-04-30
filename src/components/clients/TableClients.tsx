import {
	Box,
	Paper,
	Typography,
	LinearProgress,
	Link,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Client } from '../../interfaces/Interfaces';
import { useClients } from '../../context/ClientsContext';
import { ActionButtons } from './table/ActionButtons';
// import { TableBodyComponent } from './table/TableBodyComponent';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	ColumnDef,
	flexRender,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

// Importar el componente de estado visual correctamente
import { getStateComponent } from './ClientStatus';

export default function TableClients() {
	const { filteredClients, loading } = useClients();
	const [sorting, setSorting] = useState<SortingState>([{ id: 'nombre', desc: false }]);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const tableContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (filteredClients.length > 0 && isInitialLoad) {
			setIsInitialLoad(false);
		}
	}, [filteredClients, isInitialLoad]);

	const columns = useMemo<ColumnDef<Client>[]>(
		() => [
			{
				accessorKey: 'sName',
				header: 'Nombre',
				cell: (info) => String(info.getValue() ?? ''),
				size: 280,
			},
			{
				accessorKey: 'sDni',
				header: 'Identificación',
				cell: (info) => String(info.getValue() ?? ''),
				size: 110,
			},
			{
				accessorKey: 'sPhone',
				header: 'Teléfono',
				cell: (info) => String(info.getValue() ?? ''),
				size: 100,
			},
			{
				accessorKey: 'sector',
				header: 'Sector',
				cell: (info) => String(info.getValue() ?? ''),
				size: 130,
			},
			{
				accessorKey: 'sIp',
				header: 'IPv4',
				cell: (info) => {
					const ip = info.getValue() as string;

					if (!ip) return 'IP no asignada';
					return (
						<Link
							href={`http://${ip}`}
							target='_blank'
							rel='noopener noreferrer'
							onClick={(e) => e.stopPropagation()}
						>
							{ip}
						</Link>
					);
				},
				sortingFn: (rowA, rowB) => {
					const getIpOctets = (ip: string | null | undefined): number[] => {
						if (!ip) return [0, 0, 0, 0];
						return ip.split('.').map((octet) => parseInt(octet, 10) || 0);
					};

					const octetsA = getIpOctets(rowA.getValue('sIp'));
					const octetsB = getIpOctets(rowB.getValue('sIp'));

					for (let i = 0; i < 4; i++) {
						if (octetsA[i] !== octetsB[i]) {
							return octetsA[i] - octetsB[i];
						}
					}
					return 0;
				},
				size: 100,
			},
			{
				accessorKey: 'plan',
				header: 'Plan',
				cell: (info) => String(info.getValue() ?? ''),
				size: 130,
			},
			{
				accessorKey: 'nPayment',
				header: 'Fecha límite',
				size: 80,
				cell: (info) => {
					return (
						<Typography
							sx={{ fontSize: '0.8rem', textAlign: 'center', width: '100%' }}
							component='span'
						>
							{String(info.getValue() ?? '')}
						</Typography>
					);
				},
			},
			{
				accessorKey: 'nBalance',
				header: 'Saldo',
				cell: (info) => {
					const saldo = info.getValue() as number | null | undefined;
					const saldoValido = typeof saldo === 'number' ? saldo : 0;
					return (
						<Typography
							variant='body2'
							component='span'
							style={{
								color: saldoValido < 0 ? '#d32f2f' : '#2e7d32',
							}}
						>
							{saldoValido % 1 === 0 ? saldoValido : saldoValido.toFixed(2)}
						</Typography>
					);
				},
				size: 55,
			},
			{
				accessorKey: 'sState',
				header: 'Estado',
				cell: (info) => {
					const estado = info.getValue() as string;
					const saldo = info.row.original.nBalance;
					let realEstado = estado;
					if (estado === 'Activo') {
						realEstado = saldo < 0 ? 'Moroso' : 'Activo';
					}
					return getStateComponent(realEstado);
				},
				size: 100,
			},
			{
				id: 'acciones',
				header: '',
				cell: (info) => (
					<Box
						onClick={(e) => e.stopPropagation()}
						sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
					>
						<ActionButtons client={info.row.original} />
					</Box>
				),
				size: 50,
			},
		],
		[],
	);

	const table = useReactTable({
		data: filteredClients,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: 'onChange',
	});

	const rowVirtualizer = useVirtualizer({
		count: table.getRowModel().rows.length,
		getScrollElement: () => tableContainerRef.current,
		estimateSize: () => 48, // Altura estimada de cada fila (ajusta según tu diseño)
		overscan: 10,
	});

	const renderTableContent = () => {
		if (filteredClients.length === 0 && !loading) {
			return (
				<Box sx={{ p: 3, textAlign: 'center' }}>
					<Typography variant='subtitle1'>No se encontraron clientes</Typography>
				</Box>
			);
		}

		// Calcular el ancho total de la tabla
		const totalWidth = table
			.getAllColumns()
			.reduce((acc, column) => acc + column.getSize(), 0);

		return (
			<div
				ref={tableContainerRef}
				style={{
					height: 'calc(100vh - 15.5rem)',
					overflow: 'auto',
					width: '100%',
					position: 'relative',
				}}
			>
				<Table stickyHeader style={{ width: `${totalWidth}px`, tableLayout: 'fixed' }}>
					<TableHead>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								style={{ display: 'flex', width: '100%' }}
							>
								{headerGroup.headers.map((header) => (
									<TableCell
										key={header.id}
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-start',
											flex: 1,
											minWidth: `${header.getSize()}px`,
											padding: '6px 4px',
											fontWeight: 600,
											fontSize: '1.1rem',
											color: 'rgba(0, 0, 0, 0.87)',
										}}
									>
										<div
											{...{
												onClick:
													header.column.getToggleSortingHandler(),
												style: {
													cursor: header.column.getCanSort()
														? 'pointer'
														: 'default',
													display: 'flex',
													alignItems: 'center',
												},
											}}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
											{header.column.getIsSorted() === 'asc' && (
												<ArrowUpward
													sx={{ fontSize: '1rem', ml: 0.5 }}
												/>
											)}
											{header.column.getIsSorted() === 'desc' && (
												<ArrowDownward
													sx={{ fontSize: '1rem', ml: 0.5 }}
												/>
											)}
										</div>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						<tr
							style={{
								height: `${rowVirtualizer.getTotalSize()}px`,
								position: 'relative',
								display: 'block',
							}}
						>
							{rowVirtualizer.getVirtualItems().map((virtualRow) => {
								const row = table.getRowModel().rows[virtualRow.index];
								return (
									<TableRow
										key={row.id}
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											transform: `translateY(${virtualRow.start}px)`,
											display: 'flex',
										}}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell
												key={cell.id}
												style={{
													flex: 1,
													minWidth: `${cell.column.getSize()}px`,
													padding: '6px 4px',
												}}
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								);
							})}
						</tr>
					</TableBody>
				</Table>
			</div>
		);
	};

	return (
		<Paper
			sx={{
				overflow: 'hidden',
				boxShadow: 'none',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
				padding: 0,
				borderTopLeftRadius: 0,
				borderTopRightRadius: 0,
				borderBottomLeftRadius: 4,
				borderBottomRightRadius: 4,
			}}
		>
			{/* Cuerpo de la tabla */}
			<Box sx={{ overflow: 'hidden', padding: 0 }}>{renderTableContent()}</Box>

			{/* Indicador sutil en la parte inferior */}
			<Box
				sx={{
					boxShadow: 'inset 0 1px 0 rgba(224, 224, 224, 0.4)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					px: 2,
					py: 0.5,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography
						variant='caption'
						color='text.secondary'
						sx={{ fontSize: '0.75rem' }}
					>
						{filteredClients.length} clientes
					</Typography>
				</Box>

				{/* Show LinearProgress only while loading *and* there are clients already displayed */}
				{loading && filteredClients.length === 0 && (
					<LinearProgress sx={{ width: '30%', ml: 2, height: 4, borderRadius: 2 }} />
				)}
			</Box>
		</Paper>
	);
}
