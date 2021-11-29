import { useMemo } from 'react';

import {
  CurrencyDollarIcon as CurrencyDollarIconOutlined,
  CogIcon as CogIconOutlined,
  HomeIcon as HomeIconOutlined,
  ChatAlt2Icon as ChatAlt2IconOutlined,
} from '@heroicons/react/outline';
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  CogIcon as CogIconSolid,
  HomeIcon as HomeIconSolid,
  ChatAlt2Icon as ChatAlt2IconSolid,
} from '@heroicons/react/solid';

const useNavItems = () => {
  const sidebarNavItems = useMemo(
    () => [
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
    ],
    []
  );

  return sidebarNavItems;
};

export default useNavItems;
