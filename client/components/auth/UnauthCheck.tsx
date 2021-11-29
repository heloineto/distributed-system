import { UserContext } from '@lib/context';
import { useRouter } from 'next/dist/client/router';
import { useContext, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

const UnauthCheck = ({ children }: Props) => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  return !user ? <>{children}</> : null;
};

export default UnauthCheck;
