import DonationsLogo from '@components/decoration/logos/DonationsLogo';
import Link from 'next/link';

const Leave: NextPage = () => {
  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex justify-center">
          <Link href="/" passHref>
            <a className="inline-flex">
              <DonationsLogo />
            </a>
          </Link>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              Adeus!
            </p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              Usuário desconectado com sucesso
            </h1>
            <p className="mt-2 text-base text-gray-500">Volte quando quiser!</p>
            <div className="mt-6">
              <Link href="/enter" passHref>
                <a className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                  Entrar<span aria-hidden="true"> &rarr;</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leave;
