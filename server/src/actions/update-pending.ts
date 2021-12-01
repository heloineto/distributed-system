import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import * as yup from 'yup';

const updatePendingSchema = yup.object().shape({
  username: yup
    .string()
    .required('Forneça um usuario')
    .max(50, 'O usuario pode ter no maximo 50 caracteres'),
  receptor: yup.number().required('Forneça um receptor'),
});

const updatePending = async (message: TCPMessage) => {
  try {
    updatePendingSchema.validate(message);
    const { username, receptor } = message;

    const userRef = doc(firestore, `users/${username}`);
    await updateDoc(userRef, { receptor });

    return {
      protocol: 611,
      message: { result: true },
      required: ['result'],
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 612,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 612,
      message: {
        result: false,
        reason: String(error) ?? '',
      },
      required: ['result', 'reason'],
    };
  }
};

export default updatePending;
