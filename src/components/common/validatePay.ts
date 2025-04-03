import * as yup from 'yup';
import { PaymentDataForm } from '../../interfaces/types';

export const validationSchema = yup.object({
	tipoPago: yup.string().required(),
	referencia: yup.string().required(),
	montoRef: yup.number().required(),
	montoBs: yup.number().required(),
	reciboPor: yup.string().required(),
	tipoMoneda: yup.string().required(),
	facturaId: yup.string(),
});

export const valueInitial: PaymentDataForm = {
	tipoPago: 'Efectivo',
	tipoMoneda: 'USD',
	referencia: '',
	montoRef: 0,
	montoBs: 0,
	reciboPor: '',
	facturaId: '',
};
