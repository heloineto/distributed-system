import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import * as yup from 'yup';
import { auth, firestore } from '../lib/firebase';
import { authErrors, isFirebaseAuthError } from '../lib/utils/firebase';

const updateStep2Schema = yup.object().shape({
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
  password: yup
    .string()
    .required('Forneça uma senha')
    .max(8, 'A senha pode ter no maximo 8 caracteres'),
});

const updateStep2 = async (message: TCPMessage) => {
  try {
    await updateStep2Schema.validate(message);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 722,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 722,
      message: { result: false, reason: 'Erro desconhecido' },
      required: ['result', 'reason'],
    };
  }

  try {
    const { username, password, name, state, city } = message;

    await createUserWithEmailAndPassword(
      auth,
      `${username}@k.ey`,
      password + '*{`r=~D&5<Q2@pP'
    ).catch((error) => {});

    const userRef = doc(firestore, `users/${username}`);
    await setDoc(userRef, {
      username,
      password,
      name,
      state,
      city,
    });

    return {
      protocol: 721,
      message: { result: true },
      required: ['result'],
    };
  } catch (error) {
    if (isFirebaseAuthError(error)) {
      return {
        protocol: 722,
        message: {
          result: false,
          reason: authErrors?.[error.code].message ?? error?.message ?? error,
        },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 722,
      message: { result: false, reason: 'Erro desconhecido' },
      required: ['result', 'reason'],
    };
  }
};

export default updateStep2;
