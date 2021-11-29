const firebaseConfig = {
  apiKey: 'AIzaSyDzET-yRTajbysYsloYqY79Mkjo0wtu6vg',
  authDomain: 'donations-portal.firebaseapp.com',
  projectId: 'donations-portal',
  storageBucket: 'donations-portal.appspot.com',
  messagingSenderId: '729563043824',
  appId: '1:729563043824:web:3cbcd5c0a45d85e958ef35',
  measurementId: 'G-8KP16V0RY6',
};

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
