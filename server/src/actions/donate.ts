import * as yup from 'yup';

const donateSchema = yup.object().shape({
  donor: yup.string().max(50, 'O usuario do doador pode ter no maximo 50 caracteres'),
  receptor: yup
    .string()
    .required('Forneca um usuario receptor')
    .max(50, 'O usuario receptor pode ter no maximo 50 caracteres'),
  value: yup.number(),
});

const donate = async (message: TCPMessage) => {};

export default donate;
