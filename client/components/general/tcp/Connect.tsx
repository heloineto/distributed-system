import { Button, Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import { Autocomplete, Switches, TextField } from 'mui-rff';
import { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useSnackbar } from 'notistack';
import { useTCPListener } from '@lib/hooks';

const Connect = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down('md'));
  const [open, setOpen] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useTCPListener();

  useEffect(() => {
    const listener: (...args: any[]) => void = (_event, code) => {
      switch (code) {
        case 'connect':
          enqueueSnackbar('Socket conectado', { variant: 'success' });
          setOpen(false);
          break;
        case 'end':
          enqueueSnackbar('Socket desconectado', { variant: 'info' });
          setOpen(true);
          break;
        case 'error':
          enqueueSnackbar('Erro no socket', { variant: 'error' });
          setOpen(true);
          break;
        default:
          break;
      }
    };

    global.ipcRenderer.addListener('tcp-connection', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-connection', listener);
    };
  }, [enqueueSnackbar]);

  const connect = ({
    host,
    port,
    encoding,
    ignoreFirst,
  }: {
    host: string;
    port: string;
    encoding: BufferEncoding;
    ignoreFirst: boolean;
  }) => {
    global.ipcRenderer.send('tcp-connection', {
      host,
      port: Number(port),
      encoding,
      ignoreFirst,
    });
  };

  return (
    <Dialog fullScreen={mobile} maxWidth={'sm'} fullWidth={open} open={open}>
      <div className="p-5">
        <div className="font-bold text-3xl mb-5 text-center">
          Conecte-se a um servidor TCP
        </div>
        <Form
          onSubmit={connect}
          initialValues={{
            host: '10.20.50.26',
            port: '20026',
            encoding: 'utf8',
          }}
        >
          {({ handleSubmit, submitting, form }) => (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-4">
                <TextField label="Endereço IP" name="host" type="text" />
                <TextField label="Porta" name="port" type="text" />
                <Autocomplete
                  label="Encoding"
                  name="encoding"
                  options={[
                    'ascii',
                    'base64',
                    'base64url',
                    'utf8',
                    'utf16le',
                    'ucs2',
                    'hex',
                    'binary',
                    'latin1',
                  ]}
                  getOptionValue={(option) => option}
                  getOptionLabel={(option) => option}
                  renderOption={(option) => option}
                />
                <Switches
                  label="Tamanho no ínicio (Compatibilidade com o Java)"
                  name="ignoreFirst"
                  data={{ label: '', value: true }}
                />
              </div>
              <Button
                className="w-full mt-4 shadow-indigo-500 disabled:shadow-none disabled:bg-indigo-200"
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                Conectar
              </Button>
            </form>
          )}
        </Form>
      </div>
    </Dialog>
  );
};

export default Connect;
