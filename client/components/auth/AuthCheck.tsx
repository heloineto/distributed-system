import { UserContext } from '@lib/context';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

const AuthCheck = ({ children }: Props) => {
  const [oldUser, setOldUser] = useState<User | null>(null);
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      if (oldUser) router.replace('/leave');
      else router.replace('/enter');
    }

    setOldUser(user);
  }, [user, router]);

  return user ? <>{children}</> : null;
};

export default AuthCheck;
