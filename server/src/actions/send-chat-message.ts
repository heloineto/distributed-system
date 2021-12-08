import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import * as yup from 'yup';

const sendChatMessageSchema = yup.object().shape({
  from: yup
    .string()
    .required('Forneça um usuario from')
    .max(50, 'O usuario from pode ter no maximo 50 caracteres'),
  to: yup
    .string()
    .required('Forneça um usuario to')
    .max(50, 'O usuario to pode ter no maximo 50 caracteres'),
  message: yup.string().required('Forneça uma mensage'),
});

const sedChatMessage = async (message: TCPMessage) => {
  try {
    sendChatMessageSchema.validate(message);
    const { to, from, message: chatMessage } = message;

    // const userRef = doc(firestore, `chats/${username}`);
    // await updateDoc(userRef, { receptor });

    return {
      protocol: 501,
      message: { result: true },
      required: ['result'],
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 502,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 502,
      message: {
        result: false,
        reason: 'Erro desconhecido',
      },
      required: ['result', 'reason'],
    };
  }
};

export default sedChatMessage;
