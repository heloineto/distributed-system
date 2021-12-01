import { useContext, useMemo } from 'react';
import {
  CurrencyDollarIcon as CurrencyDollarIconOutlined,
  CogIcon as CogIconOutlined,
  HomeIcon as HomeIconOutlined,
  ChatAlt2Icon as ChatAlt2IconOutlined,
  ShieldCheckIcon as ShieldCheckIconOutlined,
} from '@heroicons/react/outline';
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  CogIcon as CogIconSolid,
  HomeIcon as HomeIconSolid,
  ChatAlt2Icon as ChatAlt2IconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
} from '@heroicons/react/solid';
import { UserContext } from '@lib/context';

const useNavItems = () => {
  const { user } = useContext(UserContext);

  const sidebarNavItems = useMemo(() => {
    const res = [
      {
        name: 'dashboard',
        label: 'Painel',
        IconOutlined: HomeIconOutlined,
        IconSolid: HomeIconSolid,
        href: '/',
      },
      {
        name: 'chat',
        label: 'Chat',
        IconOutlined: ChatAlt2IconOutlined,
        IconSolid: ChatAlt2IconSolid,
        href: '/chat',
      },
      {
        name: 'donations',
        label: 'Doações',
        IconOutlined: CurrencyDollarIconOutlined,
        IconSolid: CurrencyDollarIconSolid,
        href: '/donations',
      },
      {
        name: 'settings',
        label: 'Preferências',
        IconOutlined: CogIconOutlined,
        IconSolid: CogIconSolid,
        href: '/settings',
      },
    ];

    if (user?.usertype == 3) {
      res.push({
        name: 'admin',
        label: 'Admin',
        IconOutlined: ShieldCheckIconOutlined,
        IconSolid: ShieldCheckIconSolid,
        href: '/admin',
      });
    }

    return res;
  }, [user]);

  return sidebarNavItems;
};

export default useNavItems;
