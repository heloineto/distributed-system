import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

const getReceptorList = async () => {
  try {
    const usersRef = collection(firestore, 'users');
    const usersQuery = query(usersRef, where('receptor', '==', 1));
    const usersSnapshot = await getDocs(usersQuery);

    const users = usersSnapshot.docs.map((userDoc) => {
      const { username, name, city, state, password } = userDoc.data();
      return { username, name, city, state, password };
    });

    return {
      protocol: 401,
      message: {
        result: true,
        list: users,
      },
      required: ['result', 'list'],
    };
  } catch (error) {
    return;
  }
};

export default getReceptorList;
