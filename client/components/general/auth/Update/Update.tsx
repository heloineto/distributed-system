import { TextField, makeValidate, Autocomplete, Switches } from 'mui-rff';
import { Button, InputAdornment } from '@material-ui/core';
import PasswordField from '@components/inputs/PasswordField';
import { Form } from 'react-final-form';
import updateSchema from './utils/updateSchema';
import { useBrazilianStates, useBrazilianCities } from '@lib/hooks';
import { useContext, useEffect, useState } from 'react';
import { Skeleton } from '@material-ui/lab';
import { UserContext } from '@lib/context';
import router from 'next/router';
import { useSnackbar } from 'notistack';
import UpdateLoading from './Update.Loading';

const Update = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<User | null>(user);
  const [alreadyReceptor, setAlreadyReceptor] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) {
      enqueueSnackbar('Usuário deslogado', { variant: 'error' });
      router.push('/enter');
      return;
    }

    global.ipcRenderer.send('tcp-send', {
      protocol: 710,
      message: {
        username: user.username,
      },
      required: ['username'],
    });

    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol, message } = response;

      setAlreadyReceptor(message?.receptor == 1);

      if (protocol == 711) {
        setInitialValues({ ...user, ...message, receptor: message?.receptor != 99 });
        setLoading(false);
      }
    };

    global.ipcRenderer.addListener('tcp-recieve', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-recieve', listener);
    };
  }, []);

  const update = ({ name, state, city, password, receptor }: User) => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 720,
      message: {
        name,
        city,
        state,
        password,
        receptor: alreadyReceptor ? 1 : receptor ? 0 : 99,
      },
      required: ['name', 'city', 'state', 'password', 'receptor'],
    });
  };

  const brazilianStates = useBrazilianStates();
  const brazilianCities = useBrazilianCities();

  if (loading) {
    return <UpdateLoading />;
  }

  return (
    <div className="p-5">
      <div className="text-4xl font-bold text-gray-800 text-center">
        Atualizar Cadastro
      </div>
      <Form
        onSubmit={update}
        validate={makeValidate(updateSchema) as any}
        initialValues={initialValues}
      >
        {({ handleSubmit, submitting, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <div className="flex flex-col space-y-4">
                <TextField label="Usuário" name="username" type="text" disabled />
                <PasswordField label="Senha" name="password" />
                <TextField label="Nome" name="name" type="text" />
                <div className="flex gap-x-5">
                  <Autocomplete
                    className="w-full"
                    label="Estado"
                    name="state"
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
                <div className="mx-auto">
                  <Switches
                    className="mx-auto"
                    label={
                      alreadyReceptor
                        ? 'Receptor (você é receptor)'
                        : 'Quero Ser Receptor'
                    }
                    name="receptor"
                    disabled={alreadyReceptor}
                    data={{ label: '', value: true }}
                  />
                </div>
              </div>
              <Button
                className="w-full mt-4 shadow-indigo-500 disabled:shadow-none disabled:bg-indigo-200"
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                Atualizar Cadastro
              </Button>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};

export default Update;
