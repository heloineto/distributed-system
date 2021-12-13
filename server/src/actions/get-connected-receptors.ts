import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import * as yup from 'yup';

const getConnectedReceptors = async (users: { [k: string]: User }) => {
  try {
    const receptorList = Object.values(users)
      .filter((user) => user.usertype === 2)
      .map(({ username }) => username);

    return {
      protocol: 521,
      message: { result: true, list: receptorList },
      required: ['result', 'list'],
    };
  } catch (error) {
    return {
      protocol: 522,
      message: {
        result: false,
        reason: 'Erro desconhecido',
      },
      required: ['result', 'reason'],
    };
  }
};

export default getConnectedReceptors;
