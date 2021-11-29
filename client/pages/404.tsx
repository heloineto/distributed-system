import { ChevronRightIcon } from '@heroicons/react/solid';
import DonationsLogo from '@components/decoration/logos/DonationsLogo';
import Link from 'next/link';
import { useNavItems } from '@lib/hooks';

const _404: NextPage = () => {
  const navItems = useNavItems();

  return (
    <div className="bg-white">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 pt-10">
          <DonationsLogo className="h-16 text-indigo-900 mx-auto" />
        </div>
        <div className="max-w-xl mx-auto py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              Erro 404
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Esta página não existe.
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              A página que você está procurando não foi encontrada.
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
              Outras páginas
            </h2>
            <ul
              role="list"
              className="mt-4 border-t border-b border-gray-200 divide-y divide-gray-200"
            >
              {navItems.map(({ name, label, IconOutlined, href }) => (
                <li key={name}>
                  <Link href={href} passHref>
                    <a className="relative py-5 flex items-start space-x-4">
                      <span className="flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-50">
                        <IconOutlined className="h-6 w-6 text-indigo-700" />
                      </span>
                      <div className="my-auto font-semibold text-gray-700 min-w-0 flex-1 rounded-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        {label}
                      </div>
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400 my-auto"
                        aria-hidden="true"
                      />
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/">
                <a className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                  Voltar para o painel<span aria-hidden="true"> &rarr;</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default _404;
