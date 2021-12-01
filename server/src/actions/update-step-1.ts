import { doc, getDoc } from 'firebase/firestore';
import * as yup from 'yup';
import { firestore } from '../lib/firebase';
import { authErrors, isFirebaseAuthError } from '../lib/utils/firebase';

const updateStep1Schema = yup.object().shape({
  username: yup
    .string()
    .required('Forneça um usuario')
    .max(50, 'O usuario pode ter no maximo 50 caracteres'),
});

const updateStep1 = async (message: TCPMessage) => {
  try {
    await updateStep1Schema.validate(message);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        response: {
          protocol: 712,
          message: { result: false, reason: error.message },
          required: ['result', 'reason'],
        },
      };
    }

    return {
      response: {
        protocol: 712,
        message: { result: false, reason: 'Erro desconhecido' },
        required: ['result', 'reason'],
      },
    };
  }

  const { username } = message;

  try {
    const userRef = doc(firestore, `users/${username}`);
    const userDoc = await getDoc(userRef);

    const { name, city, state, receptor, password } = userDoc.data() as any;

    return {
      response: {
        protocol: 711,
        message: {
          result: true,
          name,
          city,
          state,
          password,
          receptor: receptor ?? 99,
        },
        required: ['result', 'name', 'city', 'state', 'password', 'receptor'],
      },
      globalUsername: username,
    };
  } catch (error) {
    if (isFirebaseAuthError(error)) {
      return {
        response: {
          protocol: 712,
          message: {
            result: false,
            reason: authErrors?.[error?.code]?.message ?? error.message ?? error,
          },
          required: ['result', 'reason'],
        },
      };
    }

    return {
      response: {
        protocol: 712,
        message: { result: false, reason: 'Erro desconhecido' },
        required: ['result', 'reason'],
      },
    };
  }
};

export default updateStep1;
