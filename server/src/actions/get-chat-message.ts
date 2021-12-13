import { addDoc, collection, doc, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import * as yup from 'yup';

const getChatMessageSchema = yup.object().shape({
  username1: yup
    .string()
    .required('Forneça um usuario username1')
    .max(50, 'O usuario from pode ter no maximo 50 caracteres'),
  username2: yup
    .string()
    .required('Forneça um usuario username2')
    .max(50, 'O usuario to pode ter no maximo 50 caracteres'),
});

const getChatMessage = async (message: TCPMessage) => {
  try {
    getChatMessageSchema.validate(message);
    const { username1, username2 } = message;

    const chatsRef = collection(firestore, `chats`);
    const usersQuery = query(chatsRef, where('to', '==', username1));
    // const usersSnapshot = await getDocs(usersQuery);

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

export default getChatMessage;
