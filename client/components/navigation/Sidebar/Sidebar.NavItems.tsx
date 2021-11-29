import Link from 'next/link';
import classNames from 'clsx';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import { indexOfNth } from '@lib/utils/typescript';
import { useNavItems } from '@lib/hooks';
import DonationsLogo from '@components/decoration/logos/DonationsLogo';

interface Props {
  expanded: boolean;
}

const SidebarNavItems = ({ expanded }: Props) => {
  const navItems = useNavItems();

  const { pathname } = useRouter();
  const currentHref = pathname.substring(0, indexOfNth(pathname, '/', 2));

  const renderNavItems = () =>
    navItems.map(({ name, label, IconOutlined, IconSolid, href }) => {
      const current = href === currentHref;

      const Icon = current ? IconSolid : IconOutlined;

      return (
        <Link key={name} href={href} aria-current={current ? 'page' : 'false'} passHref>
          <Button
            className={classNames(
              current
                ? 'bg-indigo-200 text-indigo-800'
                : 'text-gray-800 hover:text-indigo-800',
              expanded ? 'h-12 px-4 text-sm' : 'h-16 text-xs',
              'group w-full hover:bg-indigo-100'
            )}
            classes={{
              label: classNames(
                expanded
                  ? 'flex-row gap-x-2 justify-start text-'
                  : 'flex-col gap-y-1 justify-center',
                'static flex items-center'
              ),
              startIcon: 'static m-0',
            }}
            startIcon={
              <Icon
                className={classNames(
                  current
                    ? 'text-indigo-900'
                    : 'text-gray-700 group-hover:text-indigo-900',
                  expanded ? 'h-7 w-auto' : 'h-6 w-auto'
                )}
                aria-hidden="true"
              />
            }
          >
            {label}
          </Button>
        </Link>
      );
    });

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className={classNames(
          expanded
            ? 'justify-start items-end pb-[0.8rem] gap-x-3'
            : 'justify-center items-center',
          'h-20 flex w-full'
        )}
      >
        <DonationsLogo className="h-10 text-indigo-900 pl-6" />
      </div>
      <div className="flex-1 mt-2 w-full px-2 space-y-1">{renderNavItems()}</div>
    </div>
  );
};

export default SidebarNavItems;
