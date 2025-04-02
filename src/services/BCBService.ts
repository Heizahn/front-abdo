import { HOST_BCV } from '../../vite-env.d';

export const getBCV = async (): Promise<number> => {
	const res = await fetch(`${HOST_BCV}`);
	const data = await res.json();
	return data.bcv;
};

export async function getBsToUsd(montoBs: number) {
	const bcv = await getBCV();

	return (montoBs / Number((bcv * 1.08).toFixed(4))).toFixed(2);
}

export async function getUsdToBs(montoUsd: number) {
	const bcv = await getBCV();

	return (montoUsd * Number((bcv * 1.08).toFixed(4))).toFixed(2);
}
