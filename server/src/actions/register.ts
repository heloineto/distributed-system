import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as yup from 'yup';
import { auth, firestore } from '../lib/firebase';
import { authErrors, isFirebaseAuthError } from '../lib/utils/firebase';

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Forneça seu nome')
    .max(50, 'O nome pode ter no maximo 50 caracteres'),
  state: yup
    .string()
    .required('Forneça seu estado')
    .nullable()
    .max(2, 'O estado pode ter no maximo 2 caracteres'),
  city: yup
    .string()
    .required('Forneça sua cidade')
    .nullable()
    .max(50, 'A cidade pode ter no maximo 50 caracteres'),
  username: yup
    .string()
    .required('Forneça um usuario')
    .max(50, 'O usuario pode ter no maximo 50 caracteres'),
  password: yup
    .string()
    .required('Forneça uma senha')
    .max(8, 'A senha pode ter no maximo 8 caracteres'),
});

const register = async (message: TCPMessage) => {
  try {
    await registerSchema.validate(message);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 702,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 702,
      message: { result: false, reason: 'Erro desconhecido' },
      required: ['result', 'reason'],
    };
  }

  const { username, password, name, state, city } = message;

  try {
    await createUserWithEmailAndPassword(
      auth,
      `${username}@k.ey`,
      password + '*{`r=~D&5<Q2@pP'
    );

    const userRef = doc(firestore, `users/${username}`);
    await setDoc(userRef, {
      username,
      password,
      name,
      state,
      city,
      type: 1,
      receptor: 99,
    });

    return {
      protocol: 701,
      message: { result: true },
      required: ['result'],
    };
  } catch (error) {
    if (isFirebaseAuthError(error)) {
      return {
        protocol: 702,
        message: {
          result: false,
          reason: authErrors?.[error?.code]?.message ?? error.message ?? error,
        },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 702,
      message: { result: false, reason: 'Erro desconhecido' },
      required: ['result', 'reason'],
    };
  }
};

export default register;
