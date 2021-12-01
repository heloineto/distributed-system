import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import * as yup from 'yup';
import { auth, firestore } from '../lib/firebase';
import { authErrors, isFirebaseAuthError } from '../lib/utils/firebase';

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Forneca um usuario')
    .max(50, 'O usuario pode ter no maximo 50 caracteres'),
  password: yup
    .string()
    .required('Forneça uma senha')
    .max(8, 'A senha pode ter no maximo 8 caracteres'),
});

const login = async (message: TCPMessage) => {
  try {
    await loginSchema.validate(message);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 102,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 102,
      message: { result: false, reason: 'Erro desconhecido' },
      required: ['result', 'reason'],
    };
  }

  const { username, password } = message;

  try {
    await signInWithEmailAndPassword(
      auth,
      `${username}@k.ey`,
      password + '*{`r=~D&5<Q2@pP'
    );

    const userRef = doc(firestore, `users/${username}`);
    const userDoc = await getDoc(userRef);

    const { usertype } = userDoc.data() as any;

    return {
      protocol: 101,
      message: { result: true, usertype },
      required: ['result', 'usertype'],
    };
  } catch (error) {
    if (isFirebaseAuthError(error)) {
      return {
        protocol: 102,
        message: {
          result: false,
          reason: authErrors?.[error?.code]?.message ?? error.message ?? error,
        },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 102,
      message: {
        result: false,
        reason: 'Erro desconhecido',
        required: ['result', 'reason'],
      },
    };
  }
};

export default login;
