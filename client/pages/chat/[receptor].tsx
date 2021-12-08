import MainShell from '@components/app-shells/MainShell';
import { useRouter } from 'next/router';
import Messages from '@components/general/chat/Messages';

const Chat: NextPage = () => {
  const router = useRouter();

  const { receptor } = router.query;

  return (
    <MainShell>
      <div className="h-[calc(100vh-7.5rem)]">
        {typeof receptor === 'string' && <Messages receptor={receptor} />}
      </div>
    </MainShell>
  );
};

export default Chat;
