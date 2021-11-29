import { StatusOfflineIcon, StatusOnlineIcon } from '@heroicons/react/outline';
import { IconButton, Tooltip } from '@material-ui/core';
import { useEffect, useState } from 'react';
import classNames from 'clsx';

const Disconnect = () => {
  const [connected, setConnected] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const listener: (...args: any[]) => void = (_event, code) => {
      switch (code) {
        case 'connect':
          setConnected(true);
          break;
        case 'end':
          setConnected(false);
          break;
        case 'error':
          setConnected(false);
          break;
        default:
          break;
      }
    };

    global.ipcRenderer.addListener('tcp-connection', listener);

    return () => {
      global.ipcRenderer.removeListener('tcp-connection', listener);
    };
  }, []);

  const disconnect = () => {
    global.ipcRenderer.send('tcp-disconnect');
  };

  return (
    <div
      className="absolute right-4 bottom-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Tooltip title="Desconectar" arrow>
        <IconButton
          className={classNames(
            hover
              ? 'bg-yellow-200 text-yellow-600 ring-yellow-600'
              : connected
              ? 'bg-green-200 text-green-600 ring-green-600'
              : 'bg-red-200 text-red-600 ring-red-600',
            'ring-2 ring-offset-2'
          )}
          onClick={disconnect}
        >
          {connected && !hover ? (
            <StatusOnlineIcon className="h-6 w-6" />
          ) : (
            <StatusOfflineIcon className="h-6 w-6" />
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Disconnect;
