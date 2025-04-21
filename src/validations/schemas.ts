import * as yup from 'yup';

// Esquema de validación para búsqueda de clientes
export const clientSearchSchema = yup.object().shape({
  searchTerm: yup
    .string()
    .required('El término de búsqueda es requerido')
    .min(3, 'El término de búsqueda debe tener al menos 3 caracteres')
    .max(50, 'El término de búsqueda no puede tener más de 50 caracteres'),
  clientList: yup
    .string()
    .required('El tipo de cliente es requerido')
    .oneOf(['ABDO77', 'Gianni'], 'Tipo de cliente no válido')
});

// Esquema de validación para autenticación
export const authSchema = yup.object().shape({
  username: yup
    .string()
    .required('El nombre de usuario es requerido')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede tener más de 50 caracteres')
    .test('email-format', 'Formato de correo inválido', (value) => {
      if (!value) return true;
      // Si ya incluye @abdo.com, validar el formato completo
      if (value.includes('@abdo.com')) {
        return /^[a-zA-Z0-9._-]+@abdo\.com$/.test(value);
      }
      // Si no incluye @abdo.com, solo validar que no tenga caracteres especiales
      return /^[a-zA-Z0-9._-]+$/.test(value);
    })
});

// Función de utilidad para validar datos
export const validateData = async <T>(
  schema: yup.Schema<T>,
  data: unknown
): Promise<T> => {
  try {
    return await schema.validate(data, { abortEarly: false });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.reduce((acc, err) => {
        if (err.path) {
          acc[err.path] = err.message;
        }
        return acc;
      }, {} as Record<string, string>);
      throw { validationErrors: errors };
    }
    throw error;
  }
}; 