import { TextField, makeValidate } from 'mui-rff';
import { Button } from '@material-ui/core';
import enterSchema from './utils/enterSchema';
import PasswordField from '@components/inputs/PasswordField';
import { Form } from 'react-final-form';
import Link from 'next/link';
import AuthFlowShell from '@components/app-shells/AuthFlowShell';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@lib/context';

const Enter = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol, message } = response;

      if (protocol == 101)
        setUser?.({
          username: userData?.username ?? '',
          password: userData?.password,
          usertype: message?.usertype ?? 1,
        });
    };

    global.ipcRenderer.addListener('tcp-recieve', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-recieve', listener);
    };
  }, [userData]);

  const enter = ({ username, password }: User) => {
    setUserData({ username, password });

    global.ipcRenderer.send('tcp-send', {
      protocol: 100,
      message: { username, password },
      required: ['username', 'password'],
    });
  };

  return (
    <AuthFlowShell>
      <div className="-ml-1 text-7xl font-bold">Entrar</div>
      <div>
        {'Não tem uma conta? '}
        <span className="text-indigo-500 underline">
          <Link href="/register">Cadastrar.</Link>
        </span>
        <Form onSubmit={enter} validate={makeValidate(enterSchema) as any}>
          {({ handleSubmit, submitting, form }) => (
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <div className="flex flex-col space-y-4">
                  <TextField label="Usuário" name="username" type="text" />
                  <PasswordField label="Senha" name="password" />
                </div>
                <Button
                  className="w-full mt-4 shadow-indigo-500 disabled:shadow-none disabled:bg-indigo-200"
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  Entrar
                </Button>
              </div>
            </form>
          )}
        </Form>
      </div>
    </AuthFlowShell>
  );
};

export default Enter;
