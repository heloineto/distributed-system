import { ChatAlt2Icon } from '@heroicons/react/solid';
import { UserContext } from '@lib/context';
import { Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';

interface Props {}

const ChatReceptorList = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [receptors, setReceptors] = useState<string[]>([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 520,
    });

    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol, message } = response;

      if (protocol == 521) {
        const { list } = message;

        if (!list) {
          enqueueSnackbar('O servidor não retornou uma lista na mensagem', {
            variant: 'error',
          });
          return;
        }

        list.forEach((each: any) => {
          if (typeof each !== 'string') {
            enqueueSnackbar(
              'Um ou mais usuarios na lista retornada do servidor estão incorretos',
              { variant: 'error' }
            );
          }
        });
        setReceptors(list);
      }
    };

    global.ipcRenderer.addListener('tcp-recieve', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-recieve', listener);
    };
  }, []);

  return (
    <div className="p-5 flex flex-col gap-y-2.5 overflow-y-auto">
      {receptors.map((username) => (
        <div
          key={username}
          className="lg:flex lg:items-center lg:justify-between col-span-1 bg-white rounded-lg shadow p-4"
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {username}
            </h2>
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`chat/${username}`} passHref>
              <Button
                type="submit"
                className="w-full h-full px-4 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ChatAlt2Icon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Conversar
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatReceptorList;
