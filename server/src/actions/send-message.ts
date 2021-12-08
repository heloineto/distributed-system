import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import * as yup from 'yup';
import { auth, firestore } from '../lib/firebase';
import { authErrors, isFirebaseAuthError } from '../lib/utils/firebase';

const sendMessageSchema = yup.object().shape({
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

const sendMessage = async (message: TCPMessage) => {
  try {
    await sendMessageSchema.validate(message);
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
      usertype: 1,
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

export default sendMessage;
