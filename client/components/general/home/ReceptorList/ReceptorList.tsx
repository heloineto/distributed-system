import {
  CashIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  UserIcon,
} from '@heroicons/react/solid';
import { UserContext } from '@lib/context';
import { Button, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { Select, TextField } from 'mui-rff';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import receptorsSchema from './utils/receptorsSchema';

interface Props {}

const ReceptorList = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [receptors, setReceptors] = useState<PendingUser[]>([]);
  const { user } = useContext(UserContext);

  const donate = ({ value }: any, donor: string, receptor: string) => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 510,
      message: {
        value,
        donor,
        receptor,
      },
      required: ['username', 'receptor'],
    });
  };

  useEffect(() => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 400,
    });

    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol, message } = response;

      if (protocol == 401) {
        const { list } = message;

        if (!list) {
          enqueueSnackbar('O servidor não retornou uma lista na mensagem', {
            variant: 'error',
          });
          return;
        }

        try {
          list.forEach((each: any) => receptorsSchema.validate(each));
          setReceptors(list);
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
    <div className="p-5 flex flex-col gap-y-2.5 overflow-y-auto">
      {receptors.map(({ name, city, state, username }) => (
        <div
          key={username}
          className="lg:flex lg:items-center lg:justify-between col-span-1 bg-white rounded-lg shadow p-4"
        >
          <div className="flex-shrink-0 mr-5">
            <div className="relative">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={`/br-flags/${state}.jpg`}
                alt=""
              />
              <span
                className="absolute inset-0 shadow-inner rounded-full"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {name}
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <UserIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {username}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <LocationMarkerIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {state}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <OfficeBuildingIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                {city}
              </div>
            </div>
          </div>

          <Form
            onSubmit={(values) => {
              if (user?.username) donate(values, user.username, username);
            }}
          >
            {({ handleSubmit, submitting, form, values }) => (
              <form
                onSubmit={handleSubmit}
                className="mt-5 flex lg:mt-0 lg:ml-4 w-96 gap-x-5"
              >
                <TextField className="w-full flex" name="value" label="Valor" select>
                  {[1, 10, 100, 250, 500, 750, 1000, 10000].map((value) => (
                    <MenuItem key={value} value={value}>
                      <div className="flex items-center h-4">
                        <ListItemIcon>R$</ListItemIcon>
                        <ListItemText>
                          {new Intl.NumberFormat().format(value)}
                        </ListItemText>
                      </div>
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  type="submit"
                  className="w-40 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <CashIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Doar
                </Button>
              </form>
            )}
          </Form>
        </div>
      ))}
    </div>
  );
};

export default ReceptorList;
