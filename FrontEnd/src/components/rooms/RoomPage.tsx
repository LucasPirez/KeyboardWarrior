import { ProgressBar } from 'primereact/progressbar';
import TextContainer from './TextContainer';
import { useEffect, useRef, useState } from 'react';
import { Room } from '../../type';
import { serviceGame } from '../../services';
// import { SOCKET_MESSAGES } from '../../constants/socket-messages';
import { BackToRooms } from '../buttons';
import { SESSION_STORAGE } from '../../constants';

export default function RoomPage() {
  const [percentageState, setPercentageState] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);
  const refIds = useRef<
    { id: string; userName: string } | undefined
  >();

  const handleSetPercentage = (percentage: number) => {
    setPercentageState(Math.floor(percentage));
  };

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(
        window.location.hash.split('?')[1]
      );
      const id = urlParams.get('id');

      const userName = window.sessionStorage.getItem(SESSION_STORAGE);

      refIds.current = {
        id: id ?? '',
        userName: userName ?? '',
      };

      if (id) {
        const getRoom = await serviceGame.getRoom(id);
        setRoom(getRoom);
      }

      await serviceGame.listen('hola', (data) => {
        setRoom(data as Room);
      });
    })();

    return () => {
      serviceGame.removeListen('hola');
      serviceGame.removeUser(
        refIds.current?.id ?? '',
        refIds.current?.userName ?? ''
      );
    };
  }, []);

  return (
    <>
      <div>
        {room ? (
          <>
            <h2>{room.name}</h2>
            <BackToRooms roomId={room.id} />
            <section>
              <article>
                {room.listUser.map((user) => (
                  <div key={user.id}>
                    <h3>{user.userName}</h3>
                    <ProgressBar value={percentageState} />
                  </div>
                ))}
              </article>
              <TextContainer
                handleSetPercentage={handleSetPercentage}
              />
            </section>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
