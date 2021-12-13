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
  let response;
  let user: User | undefined;

  try {
    await loginSchema.validate(message);

    const { username, password } = message;

    await signInWithEmailAndPassword(
      auth,
      `${username}@k.ey`,
      password + '*{`r=~D&5<Q2@pP'
    );

    const userRef = doc(firestore, `users/${username}`);
    const userDoc = await getDoc(userRef);

    const { usertype } = userDoc.data() as any;

    user = {
      username,
      usertype,
    };

    response = {
      protocol: 101,
      message: { result: true, usertype },
      required: ['result', 'usertype'],
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      response = {
        protocol: 102,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    } else if (isFirebaseAuthError(error)) {
      response = {
        protocol: 102,
        message: {
          result: false,
          reason: authErrors?.[error?.code]?.message ?? error.message ?? error,
        },
        required: ['result', 'reason'],
      };
    } else {
      response = {
        protocol: 102,
        message: {
          result: false,
          reason: 'Erro desconhecido',
          required: ['result', 'reason'],
        },
      };
    }
  }

  return [response, user] as [typeof response, typeof user];
};

export default login;
