import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { SOCKET_MESSAGES } from '../constants/socket-messages';
import { serviceGame } from '../services';
import { type Room as RoomType } from '../type';

import './infoRoom.scss';
import JoinRoom from './rooms/JoinRoom';
import { DIC_COLORS, ROOM_STATES } from '../constants';
import { replaceObjectInArray } from '../helpers/replaceObjectInArray.helper';
import { useLogin } from '../hooks/useLogin';
import { useUser } from '../hooks/useUser';
import { navigateTo } from '../helpers';

export default function Room() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const { login } = useLogin();
  const { userName } = useUser();

  useEffect(() => {
    if (!userName) {
      navigateTo({
        path: '/login',
      });
      return;
    }
    login(userName);
    (async () => {
      const getRooms = await serviceGame.getRooms();
      setRooms(getRooms?.data ?? []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await serviceGame.listen(
        SOCKET_MESSAGES.CREATE_ROOM,
        (data) => {
          setRooms((prev) => {
            if (prev) {
              return [...prev, data as RoomType];
            }
            return [data as RoomType];
          });
        }
      );
      await serviceGame.listen(
        SOCKET_MESSAGES.CHANGE_USER_ROOM,
        (data) => {
          setRooms(
            replaceObjectInArray<RoomType>(
              data as RoomType,
              rooms,
              'id'
            )
          );
        }
      );

      await serviceGame.listen(
        SOCKET_MESSAGES.DELETE_ROOM,
        (roomId) => {
          const roomsFiltered = rooms?.filter(
            (room) => room.id !== roomId
          );

          setRooms(roomsFiltered ?? []);
        }
      );

      await serviceGame.listen(
        SOCKET_MESSAGES.START_PLAY_TIMER,
        (data) => {
          setRooms(
            replaceObjectInArray<RoomType>(
              data as RoomType,
              rooms,
              'id'
            )
          );
        }
      );
    })();

    return () => {
      serviceGame.removeListen(SOCKET_MESSAGES.CHANGE_USER_ROOM);
      serviceGame.removeListen(SOCKET_MESSAGES.CREATE_ROOM);
      serviceGame.removeListen(SOCKET_MESSAGES.START_PLAY_TIMER);
      serviceGame.removeListen(SOCKET_MESSAGES.DELETE_ROOM);
    };
  }, [rooms]);

  return (
    <section className="container">
      {rooms?.map((room) => (
        <Card
          key={Math.random()}
          style={{
            background: `${
              room.state === ROOM_STATES.PLAYING
                ? 'var(--text-color-secondary)'
                : ''
            }`,
          }}
          title={room.name}
          className="card">
          <p className="text-descriptors">
            Text:{' '}
            <span
              style={{
                color: DIC_COLORS[room.roomType],
              }}>
              {' '}
              {room.roomType}
            </span>
          </p>
          <p className="text-descriptors">
            State:{' '}
            <span
              style={{
                color: DIC_COLORS[room.roomType],
              }}>
              {room.state}
            </span>
          </p>
          <p className="text-descriptors">
            Players:{' '}
            <span
              style={{
                color: DIC_COLORS[room.roomType],
              }}>
              {' '}
              {room.listUser.length}
            </span>
          </p>
          <div className="button">
            <JoinRoom
              roomId={room.id}
              disabled={room.state === ROOM_STATES.PLAYING}
            />
          </div>
        </Card>
      ))}
    </section>
  );
}
