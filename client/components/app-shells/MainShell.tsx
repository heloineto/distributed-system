import { useState } from 'react';
import AuthCheck from '@components/auth/AuthCheck';
import Sidebar from '@components/navigation/Sidebar';
import Navbar from '@components/navigation/Navbar';

interface Props {
  children?: ReactNode;
  sideBarProps?: Partial<Parameters<typeof Sidebar>[0]>;
}

const MainShell = ({ children, sideBarProps }: Props) => {
  const [mobileSideBarOpen, setMobileSideBarOpen] = useState(false);

  const toggleMobileSideBarOpen = () => setMobileSideBarOpen((value) => !value);

  return (
    <AuthCheck>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        <Sidebar
          mobileOpen={mobileSideBarOpen}
          mobileOnClose={toggleMobileSideBarOpen}
          {...sideBarProps}
        />

        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <Navbar toggleMobileSideBarOpen={toggleMobileSideBarOpen} />

          <main className="flex-1 relative focus:outline-none overflow-y-hidden">
            {children}
          </main>
        </div>
      </div>
    </AuthCheck>
  );
};

export default MainShell;
