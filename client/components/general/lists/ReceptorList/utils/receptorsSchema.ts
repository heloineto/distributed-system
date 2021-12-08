import * as yup from 'yup';

const receptorsSchema = yup.object().shape({
  name: yup
    .string()
    .required('Forneça seu nome')
    .max(50, 'O nome pode ter no máximo 50 caracteres'),
  state: yup
    .string()
    .required('Forneça seu estado')
    .nullable()
    .max(2, 'O estado pode ter no máximo 2 caracteres'),
  city: yup
    .string()
    .required('Forneça sua cidade')
    .nullable()
    .max(50, 'A cidade pode ter no máximo 50 caracteres'),
  username: yup
    .string()
    .required('Forneça um usuário')
    .max(50, 'O usuário pode ter no máximo 50 caracteres'),
});

export default receptorsSchema;
