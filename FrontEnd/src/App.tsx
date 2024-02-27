import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { urlSocket } from './constants/url-socket';
import Room from './components/InfoRoom';
import CreateRoom from './components/CreateRoom';
import Login from './components/Login';
import RoomPage from './components/rooms/RoomPage';
import { PATH, PathType } from './constants/paths';

function App() {
  const [currentPath, setCurrentPath] = useState<PathType>('/login');

  useEffect(() => {
    (async () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${urlSocket}/Play`)
        .build();

      await connection.start();

      connection.invoke('JoinPlay', { UserName: 'Usuario1' });

      connection.on('ReceiveMessage', (message, a) => {
        console.log('mesage recibido', message, a);
      });
    })();
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(
        window.location.hash.replace('#', '') as PathType
      );
    };
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // const handleEnviar = async () => {
  // const connection = new signalR.HubConnectionBuilder()
  //   .withUrl(`${urlSocket}/room`)
  //   .build();

  // await connection.start();

  // connection.invoke('GetResponse', 'hola mastre');

  // connection.on('get', (message, a) => {
  //   console.log('mesage recibido', message, a);
  // });

  // };

  const pageToRender = {
    [PATH.game]: <RoomPage />,
    [PATH.login]: <Login />,
    [PATH.rooms]: (
      <>
        <CreateRoom />
        <Room />
      </>
    ),
  };

  return pageToRender[currentPath];
}

export default App;
