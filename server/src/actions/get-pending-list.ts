import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

const getPendingList = async () => {
  try {
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

export default getPendingList;
