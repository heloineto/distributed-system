import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
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

    const usersRef = collection(firestore, 'users');
    const usersQuery = query(usersRef, where('receptor', '==', '0'));
    const usersSnapshot = await getDocs(usersQuery);

    const users = usersSnapshot.docs.map((userDoc) => {
      const { username, name, city, state, password } = userDoc.data();
      return { username, name, city, state, password };
    });

    return {
      protocol: 601,
      message: {
        result: true,
        list: users,
      },
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 702,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 602,
      message: {
        result: false,
        reason: String(error) ?? '',
      },
      required: ['result'],
    };
  }
};

export default updatePending;
