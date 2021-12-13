import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
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
  try {
    sendChatMessageSchema.validate(message);
    const { to, message: chatMessage } = message;

    // const chatsRef = collection(firestore, `chats`);
    // await addDoc(chatsRef, { to, from, message: chatMessage });

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
    console.log(error);

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

export default sendChatMessage;
