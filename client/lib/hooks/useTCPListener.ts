import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

const useTCPListener = () => {
  const { enqueueSnackbar } = useSnackbar();

  const defErrorMsg = 'Erro sem mensagem de motivo';

  const responseProtocols: { [key: number]: any } = {
    101: {
      name: 'login-success',
      handle: () => enqueueSnackbar('Usuário logado com sucesso', { variant: 'success' }),
    },
    102: {
      name: 'login-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    701: {
      name: 'register-success',
      handle: () =>
        enqueueSnackbar('Usuário cadastrado com sucesso', { variant: 'success' }),
    },
    702: {
      name: 'register-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    711: {
      name: 'update-step-1-success',
      handle: () =>
        enqueueSnackbar('Informações do usuário recebidas', {
          variant: 'success',
        }),
    },
    712: {
      name: 'update-step-1-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    721: {
      name: 'update-step-2-success',
      handle: () =>
        enqueueSnackbar('Informações do usuário alteradas', {
          variant: 'success',
        }),
    },
    722: {
      name: 'update-step-2-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    601: {
      name: 'get-pending-list-success',
      handle: () =>
        enqueueSnackbar('Lista de pendentes recebida!', {
          variant: 'success',
        }),
    },
    602: {
      name: 'get-pending-list-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    611: {
      name: 'update-pending-success',
      handle: () =>
        enqueueSnackbar('Tipo do usuário alterado com sucesso!', {
          variant: 'success',
        }),
    },
    612: {
      name: 'update-pending-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    401: {
      name: 'get-receptor-list-success',
      handle: () =>
        enqueueSnackbar('Lista de receptores recebida!', {
          variant: 'success',
        }),
    },
    511: {
      name: 'donate-success',
      handle: () =>
        enqueueSnackbar('Doação realizada com sucesso!', {
          variant: 'success',
        }),
    },
    512: {
      name: 'donate-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    901: {
      name: 'remove-success',
      handle: () =>
        enqueueSnackbar('Usuário deletado com sucesso!', {
          variant: 'success',
        }),
    },
    902: {
      name: 'remove-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    801: {
      name: 'get-donations-list-success',
      handle: () =>
        enqueueSnackbar('Lista de doações recebida!', {
          variant: 'success',
        }),
    },
    501: {
      name: 'chat-success',
      handle: () =>
        enqueueSnackbar('Mensagem no chat enviada!', {
          variant: 'success',
        }),
    },
    502: {
      name: 'chat-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
    503: {
      name: 'chat-receptors-success',
      handle: () =>
        enqueueSnackbar('Mensagem recebida!', {
          variant: 'info',
        }),
    },
    521: {
      name: 'chat-receptors-success',
      handle: () =>
        enqueueSnackbar('Receptores conectados recebidos!', {
          variant: 'success',
        }),
    },
    522: {
      name: 'chat-receptors-error',
      variant: 'error',
      handle: (message: any) =>
        enqueueSnackbar(message?.reason ?? defErrorMsg, { variant: 'error' }),
    },
  };

  useEffect(() => {
    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol, message } = response;

      if (!protocol) {
        enqueueSnackbar('O servidor retornou uma resposta sem protocolo', {
          variant: 'error',
        });
        return;
      }

      if (!responseProtocols[protocol]) {
        enqueueSnackbar(`O servidor retornou um protocolo inválido: ${protocol}`, {
          variant: 'error',
        });
        return;
      }

      responseProtocols[protocol].handle(message);
    };

    global.ipcRenderer.addListener('tcp-recieve', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-recieve', listener);
    };
  }, [enqueueSnackbar]);
};

export default useTCPListener;
