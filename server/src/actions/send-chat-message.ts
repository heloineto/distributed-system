import * as yup from 'yup';

const sendChatMessageSchema = yup.object().shape({
  // from: yup
  //   .string()
  //   .required('Forneça um usuario from')
  //   .max(50, 'O usuario from pode ter no maximo 50 caracteres'),
  to: yup
    .string()
    .required('Forneça um usuario to')
    .max(50, 'O usuario to pode ter no maximo 50 caracteres'),
  message: yup.string().required('Forneça uma mensage'),
});

const sendChatMessage = async (message: TCPMessage) => {
  let response;
  let validMessage;

  try {
    sendChatMessageSchema.validate(message);
    const { to, message: chatMessage } = message;

    validMessage = { to, message: chatMessage };

    response = {
      protocol: 501,
      message: { result: true },
      required: ['result'],
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      response = {
        protocol: 502,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    response = {
      protocol: 502,
      message: {
        result: false,
        reason: 'Erro desconhecido',
      },
      required: ['result', 'reason'],
    };
  }

  return [response, validMessage] as [typeof response, typeof validMessage];
};

export default sendChatMessage;
