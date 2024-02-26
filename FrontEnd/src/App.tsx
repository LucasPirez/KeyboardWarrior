import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { urlSocket } from './constants/url-socket';
import Room from './components/Room';
import CreateRoom from './components/CreateRoom';

function App() {
  useEffect(() => {
    (async () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(urlSocket)
        .build();

      await connection.start();

      connection.invoke('JoinPlay', { UserName: 'Usuario1' });

      connection.on('ReceiveMessage', (message, a) => {
        console.log('mesage recibido', message, a);
      });
    })();
  }, []);

  return (
    <>
      <CreateRoom />
      <Room />
    </>
  );
}

export default App;
