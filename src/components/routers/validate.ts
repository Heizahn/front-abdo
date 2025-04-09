import * as yup from 'yup';

export const validationSchema = yup.object().shape({
	nombre: yup.string().required('Requerido'),
	ip: yup.string().required('Requerido'),
	sectoresId: yup.string().required('Requerido'),
	direccion: yup.string().required('Requerido'),
	descripcion: yup.string(),
});

export const initialValues = {
	nombre: '',
	ip: '',
	sectoresId: '',
	direccion: '',
	descripcion: '',
};

export interface IValidate {
	nombre: string;
	ip: string;
	sectoresId: string;
	direccion: string;
	descripcion: string;
}

export interface IRouterDTO extends IValidate {
	fechaCreacion: string;
	creadoPor: string;
	fechaEdicion?: string;
	editadoPor?: string;
	estado: string;
}

export interface IRouter extends IRouterDTO {
	_id: string;
}
