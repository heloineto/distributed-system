import net from 'net';
const cliSelect = require('cli-select');

const protocols: { [key: number]: string } = {
  100: 'login',
  199: 'logout',
  700: 'register',
  710: 'update-step-1',
  720: 'update-step-2',
};

const createServer = (
  port: number,
  encoding: BufferEncoding = 'utf8',
  ignoreFirst: boolean = false
) => {
  const server = net.createServer((socket) => {
    socket.setEncoding(encoding);
    console.log(`(${port}) Conexão estabelecida!`);
    let globalUsername = 'user';

    socket.on('data', async (data) => {
      let request: TCPRequest;

      try {
        console.log(data.toString());
        request = JSON.parse(data.toString().substring(data.toString().indexOf('{')));
      } catch (error) {
        console.log('ERROR: ', data, data.toString());
        console.error(`(${port}) ERRO: a solicitação não e um JSON valido.`);
        return;
      }

      console.info(`(${port}) RECEIVED:`, request);
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
          response = await login(request.message);
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
          const { response: _response, globalUsername: _globalUsername } =
            await updateStep1(request.message);

          response = _response;
          globalUsername = _globalUsername ?? 'user';
          break;
        case 720:
          const { default: updateStep2 } = await import(`./actions/update-step-2`);
          response = await updateStep2(request.message, globalUsername);
          break;
        default:
          break;
      }

      if (response) {
        if (ignoreFirst) {
          const jsonStr = JSON.stringify(response);
          const compatResponse = String.fromCharCode(jsonStr.length) + jsonStr;
          socket.write(compatResponse + '\n');
          console.info(`(${port}) SENT:`, compatResponse);
        } else {
          socket.write(JSON.stringify(response) + '\n');
          console.info(`(${port}) SENT:`, response);
        }
      }
    });

    socket.on('connect', () => console.log(`(${port}) SOCKET CONNECT`));
    socket.on('close', () => console.info(`(${port}) SOCKET CLOSE`));
    socket.on('error', (error) => console.error(`(${port}) SOCKET ERROR:`, error));
  });

  server.listen(port, () => console.info(`Servidor ouvindo na porta ${port}`));
};

const main = async () => {
  console.log('Selecione uma codificação:');
  const { value: encoding }: { value: BufferEncoding } = await cliSelect({
    values: [
      'utf8',
      'ascii',
      'base64',
      'base64url',
      'utf16le',
      'ucs2',
      'hex',
      'binary',
      'latin1',
    ],
  });
  console.log(`Selecionado: ${encoding}`);

  console.log('Tamanho no ínicio do buffer (Compatibilidade com o Java):');
  const { value }: { value: string } = await cliSelect({
    values: ['Não', 'Sim'],
  });
  console.log(`Selecionado: ${value}`);

  createServer(20026, encoding, value == 'Sim');
};

main();
