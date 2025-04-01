import * as yup from 'yup';

export const validationSchema = yup.object({
	nombre: yup.string().required('El nombre es requerido'),
	identificacion: yup.string().required('El documento de identidad es requerido'),
	telefonos: yup.string().required('El teléfono es requerido'),
	direccion: yup.string().required('La dirección es requerida'),
	coordenadas: yup.string(),
	email: yup.string().required('El correo electrónico es requerido'),
	sectoresId: yup.string().required('El sector es requerido'),
	planesId: yup.string().required('El plan es requerido'),
	ipv4: yup.string().matches(/^(\d{1,3}\.){3}\d{1,3}$/, {
		message: 'Ingrese una dirección IP válida',
		excludeEmptyString: true,
	}),
	routersId: yup.string(),
});

export const valueInitial = {
	nombre: '',
	identificacion: '',
	telefonos: '',
	direccion: '',
	coordenadas: '',
	email: '',
	sectoresId: '',
	planesId: '',
	ipv4: '',
	routersId: '',
};
