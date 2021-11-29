import { createContext, Dispatch, SetStateAction } from 'react';

const UserContext = createContext<{
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>> | null;
}>({
  user: null,
  setUser: null,
});

export default UserContext;
