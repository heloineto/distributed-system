import { BellIcon } from '@heroicons/react/outline';
import { Badge, IconButton, Tooltip } from '@material-ui/core';
import classNames from 'clsx';

interface Props {
  className: string;
  qnt?: number;
}

const NavbarNotificationsBadge = ({ className, qnt = 0 }: Props) => {
  return (
    <Tooltip title="Notificações" arrow>
      <IconButton className={classNames(className, 'text-gray-700')}>
        <Badge badgeContent={qnt} color="secondary">
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default NavbarNotificationsBadge;
