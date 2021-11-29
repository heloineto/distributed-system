import { useState } from 'react';

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  return { user, setUser };
};

export default useUser;
