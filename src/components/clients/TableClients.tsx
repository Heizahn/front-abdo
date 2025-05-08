import {
	Box,
	Paper,
	Typography,
	Link,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TableContainer,
	LinearProgress,
} from '@mui/material';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Client } from '../../interfaces/Interfaces';
import { useClients } from '../../context/ClientsContext';
import { ActionButtons } from './table/ActionButtons';
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
import { useNavigate } from 'react-router-dom';

// Importar el componente de estado visual correctamente
import { getStateComponent } from './ClientStatus';

export default function TableClients() {
	const { filteredClients, loading } = useClients();
	const [sorting, setSorting] = useState<SortingState>([{ id: 'sName', desc: false }]);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const tableContainerRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (filteredClients.length > 0 && isInitialLoad) {
			setIsInitialLoad(false);
		}
	}, [filteredClients, isInitialLoad]);

	const handleRowClick = (clientId: string) => {
		navigate(`/client/${clientId}`);
	};

	const columns = useMemo<ColumnDef<Client>[]>(
		() => [
			{
				accessorKey: 'sName',
				header: 'Nombre',
				cell: (info) => String(info.getValue() ?? ''),
			},
			{
				accessorKey: 'sDni',
				header: 'Identificación',
				cell: (info) => {
					const dni = info.getValue();
					const rif = info.row.original.sRif;
					return dni && dni !== '' ? dni : rif || '';
				},
			},
			{
				accessorKey: 'sPhone',
				header: 'Teléfono',
				cell: (info) => String(info.getValue() ?? ''),
			},
			{
				accessorKey: 'sector',
				header: 'Sector',
				cell: (info) => String(info.getValue() ?? ''),
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
			},
			{
				accessorKey: 'plan',
				header: 'Plan',
				cell: (info) => {
					const plan = info.getValue() as string;
					const velocity = info.row.original.nMBPS;
					return `${plan} (${velocity} Mbps)`;
				},
			},
			{
				accessorKey: 'nPayment',
				header: 'Fecha límite',
				cell: (info) => (
					<Typography
						sx={{ fontSize: '0.8rem', textAlign: 'center', width: '100%' }}
						component='span'
					>
						{String(info.getValue() ?? '')}
					</Typography>
				),
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
							sx={{ color: saldoValido < 0 ? '#d32f2f' : '#2e7d32' }}
						>
							{saldoValido}
						</Typography>
					);
				},
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
	});

	const rowVirtualizer = useVirtualizer({
		count: table.getRowModel().rows.length,
		getScrollElement: () => tableContainerRef.current,
		estimateSize: () => 48,
		overscan: 10,
	});

	return (
		<Paper
			sx={{
				flexGrow: 1,
				overflow: 'hidden',
				boxShadow: 'none',
				border: '1px solid rgba(224, 224, 224, 1)',
				display: 'flex',
				flexDirection: 'column',
				borderBottomRightRadius: 8,
				borderBottomLeftRadius: 8,
				height: '100%',
				minHeight: '0',
			}}
		>
			<TableContainer
				sx={{
					flex: 1,
					height: '100%', // <--- El TableContainer también ocupa todo el alto
					maxHeight: '100%',
				}}
				ref={tableContainerRef}
			>
				<Table stickyHeader size='small' aria-label='tabla de clientes'>
					<TableHead>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableCell
										key={header.id}
										sx={{ fontSize: 16, fontWeight: 'bold' }}
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
						{rowVirtualizer.getVirtualItems().length > 0 ? (
							<>
								{/* Espaciador superior */}
								{rowVirtualizer.getVirtualItems()[0].start > 0 && (
									<TableRow
										style={{
											height: rowVirtualizer.getVirtualItems()[0].start,
										}}
									>
										<TableCell
											colSpan={columns.length}
											style={{ padding: 0, border: 0 }}
										/>
									</TableRow>
								)}
								{/* Filas virtualizadas */}
								{rowVirtualizer.getVirtualItems().map((virtualRow) => {
									const row = table.getRowModel().rows[virtualRow.index];
									return (
										<TableRow
											key={row.id}
											hover
											onClick={() => handleRowClick(row.original.id)}
											sx={{
												cursor: 'pointer',
												'&:hover': {
													backgroundColor: 'rgba(0, 0, 0, 0.04)',
												},
												'&:nth-of-type(odd)': {
													backgroundColor: 'rgba(0, 0, 0, 0.02)',
												},
											}}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									);
								})}
								{/* Espaciador inferior */}
								<TableRow
									style={{
										height:
											rowVirtualizer.getTotalSize() -
											(rowVirtualizer.getVirtualItems().at(-1)?.end ??
												0),
									}}
								>
									<TableCell
										colSpan={columns.length}
										style={{ padding: 0, border: 0 }}
									/>
								</TableRow>
							</>
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} align='center'>
									No se encontraron clientes
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
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
