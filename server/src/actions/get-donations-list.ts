import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import * as yup from 'yup';

const getDonationsListSchema = yup.object().shape({
  username: yup
    .string()
    .required('Forneca um usuario')
    .max(50, 'O usuario pode ter no maximo 50 caracteres'),
});

const getDonationsList = async (message: TCPMessage) => {
  try {
    getDonationsListSchema.validate(message);

    const { username } = message;

    const donationsRef = collection(firestore, 'donations');
    const donationsQuery = query(donationsRef, where('donor', '==', username));
    const donationsSnapshot = await getDocs(donationsQuery);

    const donations = donationsSnapshot.docs.map((donationDoc) => {
      const { donor, receptor, value, anonymous } = donationDoc.data();
      return { donor, receptor, value, anonymous };
    });

    return {
      protocol: 801,
      message: {
        result: true,
        list: donations,
      },
      required: ['result', 'list'],
    };
  } catch (error) {
    console.error(error);
  }
};

export default getDonationsList;
