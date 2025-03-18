import { faker } from '@faker-js/faker';

// Sectores disponibles
const sectores = [
	'PARQUE AZUL',
	'ADUANA',
	'CENTRO GUIGUE',
	'GARCIAS',
	'TLAMITAS',
	'PANECITO',
	'GUAICA',
	'BUENAVENTURA',
	'COLONIAS',
	'BUCARITO',
	'PRIMAVERA',
	'REQUENA',
	'TROMPILLO',
	'VEGAS',
	'SAN DIEGO',
	'MARIARA',
];

// Routers disponibles
const routers = [
	'GUIGUE FO 5009',
	'TLAMITAS FO',
	'TLAMITAS',
	'4011B',
	'COLONIAS FO 4011',
	'VEGAS',
	'MARIARA FO 3221',
	'SAN DIEGO FO 1200',
];

// Planes disponibles
const planes = [
	{ nombre: '30MBPS RESIDENCIAL', precio: 20 },
	{ nombre: '60MBPS RESIDENCIAL', precio: 25 },
	{ nombre: '100MBPS RESIDENCIAL', precio: 30 },
	{ nombre: '15MBPS RESIDENCIAL', precio: 15 },
	{ nombre: '8MBPS RESIDENCIAL', precio: 10 },
	{ nombre: '10MBPS RESIDENCIAL', precio: 12 },
];

// Estados disponibles
const estados = ['Activo', 'Suspendido', 'Retirado'];

// Estados con probabilidades (para que la mayoría sean Activos)
const getRandomEstado = () => {
	const random = Math.random();
	if (random < 0.8) return 'Activo';
	if (random < 0.93) return 'Moroso';
	if (random < 0.98) return 'Suspendido';
	return 'Retirado';
};

// Generar IPs para los clientes
const generateIP = () => {
	const segments = [];

	// 40% chance for 10.81.x.x format
	if (Math.random() < 0.4) {
		segments.push('10');
		segments.push('81');
		segments.push(faker.number.int({ min: 0, max: 255 }));
		segments.push(faker.number.int({ min: 1, max: 254 }));
	}
	// 30% chance for 172.16.x.x format
	else if (Math.random() < 0.7) {
		segments.push('172');
		segments.push('16');
		segments.push(faker.number.int({ min: 0, max: 255 }));
		segments.push(faker.number.int({ min: 1, max: 254 }));
	}
	// 15% chance for 192.168.x.x format
	else if (Math.random() < 0.85) {
		segments.push('192');
		segments.push('168');
		segments.push(faker.number.int({ min: 0, max: 255 }));
		segments.push(faker.number.int({ min: 1, max: 254 }));
	}
	// 15% chance for other private IP ranges
	else {
		segments.push(faker.number.int({ min: 1, max: 255 }));
		segments.push(faker.number.int({ min: 0, max: 255 }));
		segments.push(faker.number.int({ min: 0, max: 255 }));
		segments.push(faker.number.int({ min: 1, max: 254 }));
	}

	return segments.join('.');
};

// Generar IDs venezolanos
const generateVenezuelanID = () => {
	const types = ['V', 'J', 'E'];
	const type = types[Math.floor(Math.random() * types.length)];
	const number = faker.number.int({ min: 10000000, max: 30000000 });
	return `${type}-${number}`;
};

// Generar número telefónico venezolano
const generateVenezuelanPhone = () => {
	const areaCode = faker.helpers.arrayElement(['0412', '0414', '0424', '0416', '0426']);
	const number = faker.string.numeric(7);
	return `${areaCode}${number}`;
};

// Generar un saldo (con alta probabilidad de ser negativo para clientes activos)
const generateBalance = (estado) => {
	if (estado === 'Activo') {
		// 75% de chance de tener saldo negativo
		if (Math.random() < 0.75) {
			return `-${faker.number.int({ min: 5, max: 30 })}$`;
		} else {
			return `0$`;
		}
	} else if (estado === 'Moroso') {
		return `-${faker.number.int({ min: 20, max: 60 })}$`;
	} else {
		return `0$`;
	}
};

// Generar clientes aleatorios
export const generateRandomClients = (count = 1200) => {
	const clients = [];

	for (let i = 0; i < count; i++) {
		const estado = getRandomEstado();
		const plan = faker.helpers.arrayElement(planes);

		clients.push({
			id: i + 1,
			nombre: faker.company.name().toUpperCase(),
			identificacion: generateVenezuelanID(),
			telefono: generateVenezuelanPhone(),
			sector: faker.helpers.arrayElement(sectores),
			router: faker.helpers.arrayElement(routers),
			ipv4: generateIP(),
			plan: plan.nombre,
			saldo: generateBalance(estado),
			estado: estado,
		});
	}

	return clients;
};

// Generar resumen de estadísticas
export const generateClientStats = (clients) => {
	const total = clients.length;
	const activos = clients.filter((client) => client.estado === 'Activo').length;
	const morosos = clients.filter((client) => client.estado === 'Moroso').length;
	const suspendidos = clients.filter((client) => client.estado === 'Suspendido').length;
	const retirados = clients.filter((client) => client.estado === 'Retirado').length;

	return {
		total,
		activos,
		morosos,
		suspendidos,
		retirados,
	};
};

// Exportar clientes mockeados y estadísticas
export const mockClients = generateRandomClients(5800);
export const clientStats = generateClientStats(mockClients);
