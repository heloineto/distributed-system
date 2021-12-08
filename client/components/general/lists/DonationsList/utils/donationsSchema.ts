import * as yup from 'yup';

const donationsSchema = yup.object().shape({
  donor: yup
    .string()
    .required('Forneça um usuário donor')
    .max(50, 'O usuário donor pode ter no máximo 50 caracteres'),
  receptor: yup
    .string()
    .required('Forneça um usuário receptor')
    .max(50, 'O usuário receptor pode ter no máximo 50 caracteres'),
  value: yup.number().required('Forneça um valor'),
  anonymous: yup.boolean().required('Forneca se e anonimo ou nao (bool)'),
});

export default donationsSchema;
