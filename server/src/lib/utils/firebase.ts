export const authErrors: {
  [code: string]: { message: string };
} = {
  'auth/user-not-found': {
    message: 'Usuario incorreto ou inexistente',
  },
  'auth/wrong-password': {
    message: 'Senha incorreta',
  },
  'auth/email-already-in-use': {
    message: 'Ja existe uma conta associada a este usuario',
  },
};

export interface FirebaseAuthError {
  code: string;
  message: string;
}

export const isFirebaseAuthError = (error: unknown): error is FirebaseAuthError => {
  return (
    (error as FirebaseAuthError).code !== undefined &&
    (error as FirebaseAuthError).message !== undefined
  );
};
