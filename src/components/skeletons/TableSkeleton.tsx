import { Skeleton, TableCell, TableRow } from '@mui/material';

export default function TableClientsSkeleton() {
	return (
		<>
			{Array.from(new Array(5)).map((_, index) => (
				<TableRow key={index}>
					{Array.from(new Array(10)).map((_, cellIndex) => (
						<TableCell key={cellIndex}>
							<Skeleton animation='wave' height={24} />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}
