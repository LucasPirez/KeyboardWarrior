import { useEffect, useRef, useState } from 'react';
import { Room } from '../../type';
import { serviceGame } from '../../services';
import { BackToRooms } from '../buttons';
import { ROOM_STATES, SESSION_STORAGE } from '../../constants';
import { useContextRoom } from './contextRoom';
import ListUsers from './ListUsers';
import { SOCKET_MESSAGES } from '../../constants/socket-messages';
import RenderGame from './RenderGame';
import TablePosition from './TablePosition';

import styles from './roomPage.module.css';

export default function RoomPage() {
  const refIds = useRef<
    { id: string; userName: string } | undefined
  >();
  const {
    handleSetUsers,
    room,
    handleSetRoom,
    handleSetRoomState,
    handleSetText,
  } = useContextRoom();

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

        if (getRoom?.data) {
          handleSetUsers(getRoom?.data.listUser ?? []);
          handleSetRoom(getRoom.data);
        }
      }

      await serviceGame.listen('hola', (data) => {
        handleSetRoom(data as Room);
        handleSetUsers((data as Room).listUser ?? []);
      });
      serviceGame.listen(SOCKET_MESSAGES.START_PLAY_TIMER, () => {
        handleSetRoomState(ROOM_STATES.TIMER);
      });

      serviceGame.listen(SOCKET_MESSAGES.START_GAME, (text) => {
        handleSetRoomState(ROOM_STATES.PLAYING);
        handleSetText(text as string);
      });
    })();

    return () => {
      serviceGame.removeUser(
        refIds.current?.id ?? '',
        refIds.current?.userName ?? ''
      );
      serviceGame.removeListen('hola');
      serviceGame.removeListen(SOCKET_MESSAGES.START_PLAY_TIMER);
      serviceGame.removeListen(SOCKET_MESSAGES.START_GAME);
    };
  }, []);

  const [percentage, setPercentage] = useState(0);

  const handleSetPercentage = (value: number) => {
    setPercentage(Math.round(value));
  };

  return (
    <>
      <TablePosition />
      <div>
        {room ? (
          <>
            <h2>{room.name}</h2>
            <BackToRooms roomId={room.id} />
            <section className={styles.subContainer}>
              <ListUsers percentageUser={percentage} />
              <RenderGame handleSetPercentage={handleSetPercentage} />
            </section>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
