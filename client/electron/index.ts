// Native
import { join } from 'path';
import { format } from 'url';
import net from 'net';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('.');

  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

let socket: net.Socket;

ipcMain.on(
  'tcp-send',
  (
    _event: IpcMainEvent,
    request: {
      protocol: number;
      message: { [key: string]: any };
      required: string[];
    }
  ) => {
    if (socket) {
      console.log('SENDING: ', request);
      socket.write(JSON.stringify(request));
    }
  }
);

ipcMain.on(
  'tcp-connection',
  (
    event: IpcMainEvent,
    {
      host,
      port,
      encoding,
    }: {
      host: string;
      port: number;
      encoding: BufferEncoding;
    }
  ) => {
    if (socket) {
      socket.end();
      console.log(`DESCONECTADO DO SOCKET`);
    }

    socket = net.createConnection({ host, port });
    socket.setEncoding(encoding ?? 'utf8');

    socket.on('connect', () => {
      console.info('SOCKET INFO: TCP client connected. Options:', {
        host,
        port,
        encoding,
      });
      event.sender.send('tcp-connection', 'connect');
    });

    socket.on('error', (error) => {
      console.log(`SOCKET ERROR: ${error}`);
      event.sender.send('tcp-connection', 'error');
    });

    socket.on('end', () => {
      console.log(`SOCKET ENDED`);
      event.sender.send('tcp-connection', 'end');
    });

    socket.on('close', () => {
      console.log(`SOCKET ENDED`);
      event.sender.send('tcp-connection', 'end');
    });

    socket.on('data', (data) => {
      console.log(`RECIEVED : ${data}`);

      let response;

      try {
        response = JSON.parse(data.toString());
      } catch (error) {
        console.error('Error: response is not a valid JSON.', error);
        return;
      }

      event.sender.send('tcp-recieve', response);
    });
  }
);

ipcMain.on('tcp-disconnect', (event: IpcMainEvent) => {
  socket.end();
  console.log(`DESCONECTADO DO SOCKET`);
});
