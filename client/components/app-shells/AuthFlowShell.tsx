import UnauthCheck from '@components/auth/UnauthCheck';
import DonationsLogo from '@components/decoration/logos/DonationsLogo';

interface Props {
  children: ReactNode;
}

const AuthFlowShell = ({ children }: Props) => {
  return (
    <UnauthCheck>
      <main className="overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen lg:flex">
          <div
            className={
              'relative left-0 top-0 w-full lg:w-1/2 flex justify-center min-h-[32vw]' +
              ' before:h-[125vw] before:w-[125vw] before:z-[-1] before:bg-indigo-200 before:absolute' +
              ' before:rounded-full before:top-0 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-3/4' +
              ' lg:before:fixed lg:before:top-1/2 lg:before:left-0 lg:before:-translate-x-1/2 lg:before:-translate-y-1/2'
            }
          >
            <DonationsLogo className="h-12 w-56 absolute lg:top-0 lg:left-0 mt-8 text-indigo-700" />
          </div>
          <div className="lg:w-3/5 xl:w-2/5 my-auto md:p-5 -mx-2 lg:mx-0 p-2.5 bg-gray-50 lg:bg-white rounded-xl lg:border-2 lg:border-gray-100 lg:shadow-sm lg:hover:shadow-lg transition-shadow duration-500">
            {children}
          </div>
        </div>
      </main>
    </UnauthCheck>
  );
};

export default AuthFlowShell;
