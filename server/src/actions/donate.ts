import { addDoc, collection } from 'firebase/firestore';
import * as yup from 'yup';
import { firestore } from '../lib/firebase';

const donateSchema = yup.object().shape({
  donor: yup.string().max(50, 'O usuario do doador pode ter no maximo 50 caracteres'),
  receptor: yup
    .string()
    .required('Forneca um usuario receptor')
    .max(50, 'O usuario receptor pode ter no maximo 50 caracteres'),
  value: yup.number(),
});

const donate = async (message: TCPMessage) => {
  try {
    donateSchema.validate(message);

    const { donor, receptor, value } = message;

    const usersRef = collection(firestore, 'donations');
    await addDoc(usersRef, {
      donor,
      receptor,
      value,
    });

    return {
      protocol: 511,
      message: { result: true },
      required: ['result'],
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 512,
        message: { result: false, reason: error.message },
        required: ['result', 'reason'],
      };
    }

    return {
      protocol: 512,
      message: {
        result: false,
        reason: 'Erro desconhecido',
      },
      required: ['result', 'reason'],
    };
  }
};

export default donate;
