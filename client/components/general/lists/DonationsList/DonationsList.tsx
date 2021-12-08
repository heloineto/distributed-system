import { CashIcon, ChevronRightIcon, UserIcon } from '@heroicons/react/solid';
import { UserContext } from '@lib/context';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import donationsSchema from './utils/donationsSchema';

interface Props {}

const DonationsList = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [donations, setDonations] = useState<Donation[]>([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 800,
      message: {
        username: user?.username ?? '',
      },
      required: ['username'],
    });

    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol, message } = response;

      if (protocol == 801) {
        const { list } = message;

        if (!list) {
          enqueueSnackbar('O servidor não retornou uma lista na mensagem', {
            variant: 'error',
          });
          return;
        }

        list.forEach((each: any) => {
          try {
            donationsSchema.validate(each);
          } catch (error) {
            enqueueSnackbar(
              'Um ou mais usuarios na lista retornada do servidor estão incorretos',
              { variant: 'error' }
            );
          }
        });
        setDonations(list);
      }
    };

    global.ipcRenderer.addListener('tcp-recieve', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-recieve', listener);
    };
  }, []);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md m-5">
      <ul role="list" className="divide-y divide-gray-200">
        {donations.map(({ donor, receptor, value }, idx) => (
          <li key={idx}>
            <div className="px-6 py-4 flex items-center hover:bg-gray-50 justify-between w-full">
              <div>
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {user?.name ?? user?.username}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  <span className="truncate">{donor}</span>
                </p>
              </div>
              <ChevronRightIcon className="h-7 w-7 text-gray-400" aria-hidden="true" />
              <p className="mt-2 flex items-center text-sm text-gray-500">
                <CashIcon
                  className="flex-shrink-0 mr-1.5 h-6 w-6 text-green-400"
                  aria-hidden="true"
                />
                R$ {value}
              </p>
              <ChevronRightIcon className="h-7 w-7 text-gray-400" aria-hidden="true" />
              <div className="hidden md:block">
                <div>
                  <p className="text-sm text-gray-900">{receptor}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonationsList;
