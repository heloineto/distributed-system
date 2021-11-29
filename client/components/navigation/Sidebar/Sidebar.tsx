import { Drawer, useMediaQuery, useTheme } from '@material-ui/core';
import SidebarNavItems from './Sidebar.NavItems';

interface Props {
  className?: string;
  mobileOpen: boolean;
  mobileOnClose: () => void;
  expanded?: boolean;
  toggleExpanded?: () => void;
}

const Sidebar = ({ className, mobileOpen, mobileOnClose, expanded = true }: Props) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down('md'));

  return (
    <div className={className}>
      {mobile ? (
        <Drawer
          variant="temporary"
          anchor={'left'}
          open={mobileOpen}
          onClose={mobileOnClose}
          classes={{
            paper: 'w-28',
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <SidebarNavItems expanded={false} />
        </Drawer>
      ) : (
        <div className={expanded ? 'w-60' : 'w-28'}>
          <Drawer
            classes={{
              paper: expanded ? 'w-60' : 'w-28',
            }}
            variant="permanent"
            open
          >
            <SidebarNavItems expanded={expanded} />
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
