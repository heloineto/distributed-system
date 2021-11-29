import { TextField, makeValidate, Autocomplete } from 'mui-rff';
import { Button, InputAdornment } from '@material-ui/core';
import PasswordField from '@components/inputs/PasswordField';
import { Form } from 'react-final-form';
import Link from 'next/link';
import AuthFlowShell from '@components/app-shells/AuthFlowShell';
import registerSchema from './utils/registerSchema';
import { useBrazilianStates, useBrazilianCities } from '@lib/hooks';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@lib/context';

const Register = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol } = response;

      if (protocol == 701) setUser?.(userData);
    };

    global.ipcRenderer.addListener('tcp-recieve', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-recieve', listener);
    };
  }, [userData]);

  const register = ({ name, state, city, username, password }: User) => {
    setUserData({ name, state, city, username, password });

    global.ipcRenderer.send('tcp-send', {
      protocol: 700,
      message: { username, name, city, state, password },
      required: ['username', 'name', 'city', 'state', 'password'],
    });
  };

  const brazilianStates = useBrazilianStates();
  const brazilianCities = useBrazilianCities();

  return (
    <AuthFlowShell>
      <div className="-ml-1 text-7xl font-bold">Cadastrar</div>
      <div>
        {'Já tem uma conta? '}
        <span className="text-blue-500 underline">
          <Link href="/enter">Entrar.</Link>
        </span>
        <Form onSubmit={register} validate={makeValidate(registerSchema) as any}>
          {({ handleSubmit, submitting, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <div className="flex flex-col space-y-4">
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
                  <TextField label="Usuário" name="username" type="text" />
                  <PasswordField label="Senha" name="password" />
                </div>
                <Button
                  className="w-full mt-4 shadow-indigo-500 disabled:shadow-none disabled:bg-indigo-200"
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  Cadastrar
                </Button>
              </div>
            </form>
          )}
        </Form>
      </div>
    </AuthFlowShell>
  );
};

export default Register;
