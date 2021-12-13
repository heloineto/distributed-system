import net from 'net';
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

const protocols: { [key: number]: string } = {
  100: 'login',
  199: 'logout',
  700: 'register',
  710: 'update-step-1',
  720: 'update-step-2',
  600: 'get-pending-list',
  610: 'update-pending',
  400: 'get-receptor-list',
  510: 'donate',
  900: 'remove',
  800: 'get-donations-list',
  500: 'send-chat-message',
  520: 'get-connected-receptors',
};

const updateUsersTable = (users: { [k: string]: User }) => {
  console.table(users);
};

const createServer = (port: number) => {
  const users: { [k: string]: User } = {};

  const server = net.createServer((socket) => {
    console.log(`(${port}) Conexão estabelecida!`);

    const defaultUser = {
      adress: socket.remoteAddress,
      port,
    };

    let globalUser: User = defaultUser;

    const handleChat = ({
      to,
      from,
      message,
    }: {
      to: string;
      from: string;
      message: string;
    }) => {
      if (to !== globalUser.username) return;

      const chatMsg = {
        protocol: 503,
        message: {
          from: from ?? '',
          message: message ?? '',
        },
        required: ['from', 'message'],
      };

      socket.write(JSON.stringify(chatMsg) + '\n');
      console.info(`(${port}) SENT:`, JSON.stringify(chatMsg, null, '\t'));
    };

    eventEmitter.addListener('chat', handleChat);

    socket.on('data', async (data) => {
      let request: TCPRequest;

      try {
        request = JSON.parse(data.toString().substring(data.toString().indexOf('{')));
      } catch (error) {
        console.log(`(${port}) RECEIVED (RAW):`, data.toString());
        console.error(`(${port}) ERRO: a solicitação não e um JSON valido.`);
        return;
      }

      console.log(`(${port}) RECEIVED:`, request);
      const { protocol } = request;

      if (!protocol) {
        console.error(`(${port}) ERRO: pedido sem protocolo.`);
        return;
      }

      if (!protocols[protocol]) {
        console.error(`(${port}) ERRO: protocolo invalido "${protocol}".`);
        return;
      }

      console.info(`(${port}) EXEC ACTION:`, protocols[protocol]);

      let response;

      switch (protocol) {
        case 100:
          const { default: login } = await import(`./actions/login`);
          const [loginResponse, user] = await login(request.message);

          if (user?.username) {
            globalUser = { ...globalUser, ...user };
            users[user?.username] = globalUser;

            updateUsersTable(users);
          }

          response = loginResponse;
          break;
        case 199:
          const { default: logout } = await import(`./actions/logout`);
          response = await logout();

          if (globalUser?.username) {
            delete users[globalUser.username];
            globalUser = defaultUser;

            updateUsersTable(users);
          }

          break;
        case 700:
          const { default: register } = await import(`./actions/register`);
          response = await register(request.message);
          break;
        case 710:
          const { default: updateStep1 } = await import(`./actions/update-step-1`);
          response = await updateStep1(request.message);
          break;
        case 720:
          const { default: updateStep2 } = await import(`./actions/update-step-2`);
          response = await updateStep2(request.message, globalUser?.username);
          break;
        case 600:
          const { default: getPendingList } = await import(`./actions/get-pending-list`);
          response = await getPendingList();
          break;
        case 610:
          const { default: updatePending } = await import(`./actions/update-pending`);
          response = await updatePending(request.message);
          break;
        case 400:
          const { default: getReceptorList } = await import(
            `./actions/get-receptor-list`
          );
          response = await getReceptorList(request.message);
          break;
        case 510:
          const { default: donate } = await import(`./actions/donate`);
          response = await donate(request.message);
          break;
        case 900:
          const { default: remove } = await import(`./actions/remove`);
          response = await remove(request.message);
          break;
        case 800:
          const { default: getDonationsList } = await import(
            `./actions/get-donations-list`
          );
          response = await getDonationsList(request.message);
          break;
        case 500:
          const { default: sendChatMessage } = await import(
            `./actions/send-chat-message`
          );
          const [response_, validMessage] = await sendChatMessage(request.message);
          response = response_;

          console.log(validMessage);

          if (validMessage) {
            eventEmitter.emit('chat', { ...validMessage, from: globalUser?.username });
          }
          break;
        case 520:
          const { default: getConnectedReceptors } = await import(
            `./actions/get-connected-receptors`
          );
          response = await getConnectedReceptors(users);
          break;

        default:
          break;
      }

      if (response) {
        socket.write(JSON.stringify(response) + '\n');
        console.info(`(${port}) SENT:`, JSON.stringify(response, null, '\t'));
      }
    });

    socket.on('connect', () => console.log(`(${port}) SOCKET CONNECT`));

    socket.on('close', () => {
      console.info(`(${port}) SOCKET CLOSE`);
      if (globalUser?.username) {
        delete users[globalUser.username];
        globalUser = defaultUser;

        updateUsersTable(users);
      }

      eventEmitter.removeListener('chat', handleChat);
    });

    socket.on('error', (error) => {
      console.error(`(${port}) SOCKET ERROR:`, error);

      if (globalUser?.username) {
        delete users[globalUser.username];
        globalUser = defaultUser;

        updateUsersTable(users);
      }

      eventEmitter.removeListener('chat', handleChat);
    });
  });

  server.listen(port, () => console.info(`Servidor ouvindo na porta ${port}`));
};

createServer(20026);
