import {
  CashIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  UserIcon,
} from '@heroicons/react/solid';
import { UserContext } from '@lib/context';
import {
  Button,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@material-ui/core';
import { Autocomplete, Select, Switches, TextField } from 'mui-rff';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import receptorsSchema from './utils/receptorsSchema';
import { useBrazilianStates, useBrazilianCities } from '@lib/hooks';
import { SearchIcon } from '@heroicons/react/outline';
import { isNil, omitBy } from 'lodash';

interface Props {}

const ReceptorList = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [receptors, setReceptors] = useState<PendingUser[]>([]);
  const { user } = useContext(UserContext);
  const brazilianStates = useBrazilianStates();
  const brazilianCities = useBrazilianCities();

  const handleFilter = ({ name, username, state, city }: User) => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 400,
      message: {
        filter: omitBy(
          {
            name,
            username,
            state,
            city,
          },
          isNil
        ),
      },
      required: ['filter'],
    });
  };

  const donate = ({ value, anonymous }: any, donor: string, receptor: string) => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 510,
      message: {
        donor,
        receptor,
        value,
        anonymous,
      },
      required: ['donor', 'receptor', 'value', 'anonymous'],
    });
  };

  useEffect(() => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 400,
      message: { filter: {} },
      required: ['filter'],
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

        list.forEach((each: any) => {
          try {
            receptorsSchema.validate(each);
          } catch (error) {
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
      <Form onSubmit={handleFilter}>
        {({ handleSubmit, submitting, values }) => (
          <form
            onSubmit={handleSubmit}
            className="flex gap-x-5 bg-white rounded-lg shadow p-4"
          >
            <div className="w-full">
              <div className="flex flex-col space-y-2">
                <TextField label="Nome" name="name" type="text" size="small" />
                <div className="flex gap-x-5">
                  <Autocomplete
                    className="w-full"
                    label="Estado"
                    name="state"
                    size="small"
                    options={brazilianStates}
                    getOptionValue={(option) => option.abbr}
                    getOptionLabel={(option) => option.name}
                    renderOption={({ name, abbr }) => (
                      <div className="flex items-center gap-x-2">
                        <img
                          className="h-4 rounded-sm"
                          src={`br-flags/${abbr}.jpg`}
                          alt={`${name}'s flag`}
                        />
                        {name}
                      </div>
                    )}
                    textFieldProps={{
                      InputProps: values.state
                        ? {
                            startAdornment: (
                              <InputAdornment position="start">
                                <img
                                  className="h-5 rounded-sm"
                                  src={`br-flags/${values.state}.jpg`}
                                  alt={`${name}'s flag`}
                                />
                              </InputAdornment>
                            ),
                          }
                        : undefined,
                    }}
                  />
                  <Autocomplete
                    className="w-full"
                    label="Cidade"
                    size="small"
                    name="city"
                    disabled={!values.state}
                    options={
                      values.state
                        ? brazilianCities[values.state as keyof typeof brazilianCities]
                        : []
                    }
                    getOptionValue={(option) => option}
                    getOptionLabel={(option) => option}
                    renderOption={(option) => option}
                  />
                </div>
                <TextField label="Usuário" name="username" type="text" size="small" />
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-40 h-full px-4 py-2 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <SearchIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Filtrar
              </Button>
            </div>
          </form>
        )}
      </Form>
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
            initialValues={{
              anonymous: false,
            }}
          >
            {({ handleSubmit, submitting, form, values }) => (
              <form
                onSubmit={handleSubmit}
                className="mt-5 flex lg:mt-0 lg:ml-4 w-96 gap-x-5"
              >
                <div>
                  <Switches
                    label="Anônimo"
                    name="anonymous"
                    data={{ label: '', value: false }}
                  />
                </div>
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
                {/* {JSON.stringify(values)} */}
              </form>
            )}
          </Form>
        </div>
      ))}
    </div>
  );
};

export default ReceptorList;
