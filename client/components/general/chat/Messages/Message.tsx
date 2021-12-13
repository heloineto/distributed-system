import { PaperAirplaneIcon } from '@heroicons/react/solid';
import { UserContext } from '@lib/context';
import { IconButton } from '@material-ui/core';
import { TextField } from 'mui-rff';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import ChatBubbleLeft from './ChatBubbleLeft';
import ChatBubbleRight from './ChatBubbleRight';
import classNames from 'clsx';
import { useSnackbar } from 'notistack';

interface Props {
  receptor: string;
}

const Message = ({ receptor }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const listener: (...args: any[]) => void = (_event, response) => {
      const { protocol, message } = response;

      if (protocol == 503) {
        const { from, message: chatMessage } = message;

        if (!message || !from) {
          enqueueSnackbar('O servidor não enviou uma mensagem ou o correspondente', {
            variant: 'error',
          });
          return;
        }

        setMessages((value) => [
          ...value,
          { from, message: chatMessage, direction: 'left' },
        ]);
      }
    };

    global.ipcRenderer.addListener('tcp-recieve', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-recieve', listener);
    };
  }, []);

  const sendMessage = ({ message, to }: any, to2: string) => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 500,
      message: {
        to: to ?? to2,
        message,
      },
      required: ['to', 'message'],
    });

    if (user?.username) {
      setMessages((value) => [
        ...value,
        { from: user?.username, message, direction: 'right' },
      ]);
    }
  };

  return (
    <div className="m-5 rounded-md h-full flex flex-col bg-white p-2.5">
      <div className="flex-1 flex gap-y-2 flex-col h-[100%] overflow-y-auto">
        {messages.map(({ from, message, direction }) =>
          direction === 'left' ? (
            <ChatBubbleLeft username={from}>{message}</ChatBubbleLeft>
          ) : (
            <ChatBubbleRight username={from}>{message}</ChatBubbleRight>
          )
        )}
      </div>
      <div>
        <Form onSubmit={(values) => sendMessage(values, receptor)}>
          {({ handleSubmit, submitting, form, values }) => (
            <form onSubmit={handleSubmit} className="flex mt-2.5 gap-x-5 w-full pr-20">
              <TextField className="w-full" name="message" placeholder="Mensagem" />
              <TextField className="w-1/3" name="to" placeholder="Para" />
              <IconButton
                disabled={!values.message}
                type="submit"
                onClick={() => {
                  form.submit();
                  form.reset();
                }}
                className={classNames(
                  !values.message
                    ? 'bg-gray-300 text-gray-700'
                    : 'bg-indigo-300 text-indigo-600',
                  'w-14 h-14 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                )}
              >
                <PaperAirplaneIcon className="transform rotate-90 h-6 w-6 ml-1" />
              </IconButton>
              {/* {JSON.stringify(values)} */}
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Message;
