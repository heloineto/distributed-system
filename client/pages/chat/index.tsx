import MainShell from '@components/app-shells/MainShell';
import ChatReceptorList from '@components/general/chat/ChatReceptorList';

const Chat: NextPage = () => {
  return (
    <MainShell>
      <ChatReceptorList />
    </MainShell>
  );
};

export default Chat;
