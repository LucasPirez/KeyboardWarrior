import { useEffect, useRef, useState } from 'react';
import { Room, TimeWriting } from '../../type';
import { serviceGame } from '../../services';
import { BackToRooms } from '../buttons';
import { PATH, ROOM_STATES } from '../../constants';
import { useContextRoom } from './contextRoom';
import ListUsers from './ListUsers';
import { SOCKET_MESSAGES } from '../../constants/socket-messages';
import RenderGame from './RenderGame';
import TablePosition from './TablePosition';

import styles from './roomPage.module.css';
import { useUser } from '../../hooks/useUser';
import { navigateTo } from '../../helpers';

export default function RoomPage() {
  const [percentage, setPercentage] = useState(0);
  const { userName } = useUser();

  const refError = useRef(0);
  const refTimeTyping = useRef<TimeWriting>({ end: 0, start: 0 });
  const refIds = useRef<
    { id: string; userName: string } | undefined
  >();
  const {
    handleSetUsers,
    room,
    handleSetRoom,
    handleSetRoomState,
    handleSetText,
    handleResetRoom,
  } = useContextRoom();

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(
        window.location.hash.split('?')[1]
      );
      const id = urlParams.get('id');

      refIds.current = {
        id: id ?? '',
        userName: userName ?? '',
      };

      if (id && userName) {
        const result = await serviceGame.joinRoom(id, userName);

        if (
          !result?.data ||
          result?.data.state === ROOM_STATES.PLAYING
        ) {
          navigateTo({
            path: PATH.rooms,
          });
        }
        const getRoom = await serviceGame.getRoom(id);

        if (getRoom?.data) {
          handleSetUsers(getRoom?.data.listUser ?? []);
          handleSetRoom(getRoom.data);
        }
      }

      await serviceGame.listen(SOCKET_MESSAGES.ROOM_DATA, (data) => {
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

      serviceGame.listen(SOCKET_MESSAGES.RESTART_ROOM, (roomDTO) => {
        const roomDt = roomDTO as Room;
        handleResetRoom(roomDt);
        setPercentage(0);
      });
    })();

    return () => {
      serviceGame.removeUser(
        refIds.current?.id ?? '',
        refIds.current?.userName ?? ''
      );
      serviceGame.removeListen(SOCKET_MESSAGES.ROOM_DATA);
      serviceGame.removeListen(SOCKET_MESSAGES.START_PLAY_TIMER);
      serviceGame.removeListen(SOCKET_MESSAGES.START_GAME);
      serviceGame.removeListen(SOCKET_MESSAGES.RESTART_ROOM);
    };
  }, []);

  const handleSetPercentage = (value: number) => {
    setPercentage(value);
  };

  const handleMutableError = () => {
    refError.current++;
  };

  return (
    <>
      <TablePosition />
      {room ? (
        <article className={styles.container}>
          <BackToRooms
            roomId={room.id}
            className={styles.buttonBack}
          />
          <header>
            <h2 className={styles.title}>{room.name}</h2>
          </header>
          <section className={styles.subContainer}>
            <section className={styles.containerListUsers}>
              <ListUsers percentageUser={percentage} />
            </section>
            <section className={styles.containerGame}>
              <RenderGame
                handleSetPercentage={handleSetPercentage}
                refError={refError.current}
                refTimeTyping={refTimeTyping.current}
                handleMutableError={handleMutableError}
              />
            </section>
          </section>
        </article>
      ) : (
        ''
      )}
    </>
  );
}
