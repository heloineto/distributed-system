import { deleteDoc, doc } from 'firebase/firestore';
import * as yup from 'yup';
import { auth, firestore } from '../lib/firebase';

const removeSchema = yup.object().shape({
  username: yup
    .string()
    .required('Forneca um usuario')
    .max(50, 'O usuario pode ter no maximo 50 caracteres'),
});

const remove = async (message: TCPMessage) => {
  try {
    removeSchema.validate(message);

    const { username } = message;
    await auth.currentUser?.delete();
    await deleteDoc(doc(firestore, `users/${username}`));

    return {
      protocol: 901,
      message: { result: true },
      required: ['result'],
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 902,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 902,
      message: { result: false, reason: 'Erro desconhecido' },
      required: ['result', 'reason'],
    };
  }
};

export default remove;
