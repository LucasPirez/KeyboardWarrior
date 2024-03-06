import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { SOCKET_MESSAGES } from '../constants/socket-messages';
import { serviceGame } from '../services';
import { type Room as RoomType } from '../type';

import './infoRoom.scss';
import JoinRoom from './rooms/JoinRoom';

export default function Room() {
  const [rooms, setRooms] = useState<RoomType[] | null>(null);

  useEffect(() => {
    (async () => {
      const getRooms = await serviceGame.getRooms();
      setRooms(getRooms);
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
          const roomsUpdated =
            rooms?.map((room) => {
              if (room.id !== (data as RoomType).id) {
                return room;
              } else {
                return data as RoomType;
              }
            }) ?? null;

          setRooms(roomsUpdated);
        }
      );
    })();

    return () => {
      serviceGame.removeListen(SOCKET_MESSAGES.CHANGE_USER_ROOM);
      serviceGame.removeListen(SOCKET_MESSAGES.CREATE_ROOM);
    };
  }, [rooms]);

  return (
    <section className="container">
      {rooms &&
        rooms.map((room) => (
          <Card key={Math.random()} style={{}} title={room.name}>
            <p>Count players: {room.listUser.length}</p>

            <JoinRoom roomId={room.id} />
            <p>
              <small> state room: {room.state}</small>
            </p>
          </Card>
        ))}
    </section>
  );
}
