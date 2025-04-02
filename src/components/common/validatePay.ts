import * as yup from 'yup';

export const validationSchema = yup.object({
	tipoPago: yup.string().required(),
	referencia: yup.string().required(),
	montoRef: yup.number().required(),
	montoBs: yup.number().required(),
	reciboPor: yup.string().required(),
	facturaId: yup.string(),
});

export const valueInitial = {
	tipoPago: 'Efectivo',
	referencia: '',
	montoRef: 0,
	montoBs: 0,
	reciboPor: '',
	facturaId: '',
};
