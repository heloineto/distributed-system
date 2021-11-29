import { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { LogoutIcon, MenuIcon } from '@heroicons/react/outline';
import { UserContext } from '@lib/context';
import NavbarNotificationsBadge from './Navbar.NotificationsBadge';

interface Props {
  toggleMobileSideBarOpen?: () => void;
}

const Navbar = ({ toggleMobileSideBarOpen }: Props) => {
  const { user, setUser } = useContext(UserContext);

  const leave = () => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 199,
    });

    setUser?.(null);
  };

  return (
    <header className="w-full relative z-10 flex-shrink-0 h-20 bg-white border-b border-gray-200 flex">
      <div className="flex-1 flex justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <IconButton
            className="h-12 w-12 lg:hidden"
            edge="start"
            onClick={toggleMobileSideBarOpen}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </IconButton>
          <div className="lg:w-[32rem]" />
        </div>
        {user && (
          <div className="ml-4 flex items-center sm:ml-6">
            <NavbarNotificationsBadge className="w-12 h-12" />
            <Tooltip title="Sair" arrow>
              <IconButton className="w-12 h-12 my-auto" edge="end" onClick={leave}>
                <LogoutIcon className="h-6 w-6 text-gray-700" />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
