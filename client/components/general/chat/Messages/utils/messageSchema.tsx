import * as yup from 'yup';

const messageSchema = yup.object().shape({
  message: yup.string().required('Forneça uma mensagem'),
});

export default messageSchema;
