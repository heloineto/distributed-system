import * as yup from 'yup';

const enterSchema = yup.object().shape({
  username: yup
    .string()
    .required('Forneça um usuário')
    .max(50, 'O usuário pode ter no máximo 50 caracteres'),
  password: yup
    .string()
    .required('Forneça uma senha')
    .max(8, 'A senha pode ter no máximo 8 caracteres'),
});

export default enterSchema;
