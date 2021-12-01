import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import { Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import pendingUserSchema from './utils/pendingUserSchema';

interface Props {}

const PendingList = (props: Props) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (username: string, receptor: number) => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 610,
      message: {
        username,
        receptor,
      },
      required: ['username', 'receptor'],
    });

    global.ipcRenderer.send('tcp-send', {
      protocol: 600,
    });
  };

  useEffect(() => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 600,
    });

    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol, message } = response;

      if (protocol == 601) {
        const { list } = message;

        if (!list) {
          enqueueSnackbar('O servidor não retornou uma lista na mensagem', {
            variant: 'error',
          });
          return;
        }

        try {
          list.forEach((each: any) => pendingUserSchema.validate(each));
          setPendingUsers(list);
        } catch (error) {
          enqueueSnackbar(
            'Um ou mais usuarios na lista retornada do servidor estão incorretos',
            { variant: 'error' }
          );
        }
      }
    };

    global.ipcRenderer.addListener('tcp-recieve', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-recieve', listener);
    };
  }, []);

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 m-5">
      {pendingUsers.map(({ name, city, state, username }) => (
        <li
          key={username}
          className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
        >
          <div className="w-full flex items-center justify-between p-5 pb-2 space-x-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="text-gray-900 text-sm font-medium truncate">{name}</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-gray-800 text-xs font-medium bg-gray-200 rounded-full">
                  @{username}
                </span>
              </div>
              <p className="mt-1 text-gray-500 text-sm truncate">{`${city} - ${state}`}</p>
            </div>
          </div>
          <div>
            <div className="flex divide-gray-200">
              <div className="w-0 flex-1 flex p-2.5">
                <Button
                  className="bg-green-500 text-white relative flex-1 py-4 text-sm hover:bg-green-600"
                  onClick={() => handleClick(username, 1)}
                >
                  <CheckCircleIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-3">Aceitar</span>
                </Button>
              </div>
              <div className="-ml-px w-0 flex-1 flex p-2.5">
                <Button
                  className="bg-red-500 text-white relative flex-1 py-4 text-sm hover:bg-red-600"
                  onClick={() => handleClick(username, 99)}
                >
                  <XCircleIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-3">Rejeitar</span>
                </Button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PendingList;
