import net from 'net';
const cliSelect = require('cli-select');

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
};

const createServer = (port: number) => {
  const users: { [k: string]: User } = {};

  const server = net.createServer((socket) => {
    console.log(`(${port}) Conexão estabelecida!`);
    let globalUsername = 'user';

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
          const [response_, user] = await login(request.message);

          if (user) {
            users[user?.username] = user;
          }

          response = response_;
          break;
        case 199:
          const { default: logout } = await import(`./actions/logout`);
          response = await logout();
          break;
        case 700:
          const { default: register } = await import(`./actions/register`);
          response = await register(request.message);
          break;
        case 710:
          const { default: updateStep1 } = await import(`./actions/update-step-1`);
          response = await updateStep1(request.message);

          globalUsername = 'user';
          break;
        case 720:
          const { default: updateStep2 } = await import(`./actions/update-step-2`);
          response = await updateStep2(request.message, globalUsername);
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
          response = await sendChatMessage(request.message);
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
    socket.on('close', () => console.info(`(${port}) SOCKET CLOSE`));
    socket.on('error', (error) => console.error(`(${port}) SOCKET ERROR:`, error));
  });

  server.listen(port, () => console.info(`Servidor ouvindo na porta ${port}`));
};

createServer(20026);
