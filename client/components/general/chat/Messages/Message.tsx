import { PaperAirplaneIcon } from '@heroicons/react/solid';
import { UserContext } from '@lib/context';
import { IconButton } from '@material-ui/core';
import { makeValidate, TextField } from 'mui-rff';
import { useContext } from 'react';
import { Form } from 'react-final-form';
import ChatBubbleLeft from './ChatBubbleLeft';
import ChatBubbleRight from './ChatBubbleRight';
import messageSchema from './utils/messageSchema';

interface Props {
  receptor: string;
}

const Message = ({ receptor }: Props) => {
  const { user } = useContext(UserContext);

  const sendMessage = ({ message }: any, from: string, to: string) => {
    global.ipcRenderer.send('tcp-send', {
      protocol: 500,
      message: {
        from,
        to,
        message,
      },
      required: ['from', 'to', 'message'],
    });
  };

  return (
    <div className="m-5 rounded-md h-full flex flex-col bg-white p-2.5">
      <div className="flex-1 flex gap-y-2 flex-col">
        <ChatBubbleLeft />
        <ChatBubbleRight />
      </div>
      <div>
        <Form
          onSubmit={(values) => {
            console.log('HIUII');

            if (user?.username) sendMessage(values, user?.username, receptor);
          }}
          validate={makeValidate(messageSchema) as any}
        >
          {({ handleSubmit, submitting, form, values }) => (
            <form onSubmit={handleSubmit} className="flex mt-2.5 gap-x-5 w-full pr-20">
              <TextField className="w-full" name="message" placeholder="Mensagem" />
              <IconButton
                type="submit"
                className="bg-indigo-300 text-indigo-600 w-14  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
