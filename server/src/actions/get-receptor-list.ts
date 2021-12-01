import { collection, getDocs, query, QueryConstraint, where } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import * as yup from 'yup';

const getReceptorListSchema = yup.object().shape({
  filter: yup.object().shape({
    name: yup.string().max(50, 'O nome pode ter no maximo 50 caracteres'),
    state: yup.string().nullable().max(2, 'O estado pode ter no maximo 2 caracteres'),
    city: yup.string().nullable().max(50, 'A cidade pode ter no maximo 50 caracteres'),
    username: yup.string().max(50, 'O usuario pode ter no maximo 50 caracteres'),
  }),
});

const getReceptorList = async (message: TCPMessage) => {
  try {
    getReceptorListSchema.validate(message);

    const queryConstraints: QueryConstraint[] = [];

    if (message?.filter) {
      if (message?.filter?.name)
        queryConstraints.push(where('name', '==', message.filter.name));
      if (message?.filter?.username)
        queryConstraints.push(where('username', '==', message.filter.username));
      if (message?.filter?.state)
        queryConstraints.push(where('state', '==', message.filter.state));
      if (message?.filter?.city)
        queryConstraints.push(where('city', '==', message.filter.city));
    }

    const usersRef = collection(firestore, 'users');
    const usersQuery = query(usersRef, where('receptor', '==', 1), ...queryConstraints);
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
    if (error instanceof yup.ValidationError) {
      return {
        protocol: 402,
        message: { result: false, reason: error.message },
        required: ['result'],
      };
    }

    return;
  }
};

export default getReceptorList;
