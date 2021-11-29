import net from 'net';
const prompt = require('prompt-sync')();

const protocols: { [key: number]: string } = {
  100: 'login',
  199: 'logout',
  700: 'register',
  710: 'update-step-1',
  720: 'update-step-2',
};

const createServer = (port: number, encoding: BufferEncoding = 'utf8') => {
  const server = net.createServer((socket) => {
    socket.setEncoding(encoding);
    console.log(`(${port}) Conexão estabelecida!`);

    socket.on('data', async (data) => {
      let request: TCPRequest;
      console.log(data.toString());

      try {
        request = JSON.parse(data.toString());
      } catch (error) {
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

      const { default: action } = await import(`./actions/${protocols[protocol]}`);
      const response = await action(request.message);

      if (response) {
        socket.write(JSON.stringify(response));
        console.info(`(${port}) SENT:`, response);
      }
    });

    socket.on('connect', () => console.log(`(${port}) SOCKET CONNECT`));
    socket.on('close', () => console.info(`(${port}) SOCKET CLOSE`));
    socket.on('error', (error) => console.error(`(${port}) SOCKET ERROR:`, error));
  });

  server.listen(port, () => console.info(`Servidor ouvindo na porta ${port}`));
};

const enconding = prompt(
  'Digite sua encoding (ascii, base64, utf8, hex, binary, latin1): '
);

createServer(20026, enconding);
