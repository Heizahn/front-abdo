import * as yup from 'yup';

export const validationSchema = yup.object().shape({
	sName: yup
		.string()
		.max(25, 'Este campo debe tener máximo 25 caracteres')
		.required('Este campo es obligatorio'),
	typeDni: yup.string().required('Este campo es obligatorio'),
	sDni: yup
		.string()
		.max(12, 'Este campo debe tener máximo 15 caracteres')
		.required('Este campo es obligatorio'),
	sPhone: yup
		.string()
		.max(15, 'Este campo debe tener máximo 15 caracteres')
		.required('Este campo es obligatorio'),
	sAddress: yup
		.string()
		.max(100, 'Este campo debe tener máximo 100 caracteres')
		.required('Este campo es obligatorio'),
	idSector: yup.string().required('Este campo es obligatorio'),
	idSubscription: yup.string().required('Este campo es obligatorio'),
	sType: yup.string().required('Este campo es obligatorio'),
	sGps: yup
		.string()
		.max(25)
		.test(
			'gps-format',
			'Ingrese un GPS válido (ej: 10.1234567, -66.1234567)',
			(value) =>
				!value || /^-?[0-9]{1,2}\.[0-9]{1,7}, ?-?[0-9]{1,2}\.[0-9]{1,7}$/.test(value),
		),
	idOwner: yup.string().when('$userRole', {
		is: (role: number) => role !== 3 && role !== 5,
		then: (schema) => schema.required('Este campo es obligatorio'),
		otherwise: (schema) => schema.notRequired(),
	}),
	sIp: yup.string().when('$sType', {
		is: (type: string) => type === 'RF',
		then: (schema) => schema.required('Este campo es obligatorio'),
		otherwise: (schema) => schema.notRequired(),
	}),
	sSn: yup
		.string()
		.when('$sType', {
			is: (type: string) => type === 'FO',
			then: (schema) => schema.required('Este campo es obligatorio'),
			otherwise: (schema) => schema.notRequired(),
		})
		.max(12, 'Este campo debe tener máximo 12 caracteres'),
	sCommentary: yup.string().max(155, 'Este campo debe tener máximo 155 caracteres'),
});

export const valueInitial = {
	sName: '',
	typeDni: '',
	sDni: '',
	sPhone: '',
	sAddress: '',
	sGps: '',
	idOwner: '',
	idSector: '',
	idSubscription: '',
	sIp: '',
	sType: '',
	sSn: '',
	sRif: '',
	sCommentary: '',
};
