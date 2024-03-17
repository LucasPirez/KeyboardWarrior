import { ROOM_STATES } from '../../constants';
import { type Room, type RoomStateType, type User } from '../../type';
import {
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

interface State {
  users: User[];
  usersPlayState: Record<
    string,
    {
      percentage: number;
    }
  >;
  roomState: RoomStateType;
  usersCount: number;
  room: (Room & { text: string }) | null;
  handleSetUsers: (users: User[]) => void;
  handleSetRoomState: (room: RoomStateType) => void;
  handleSetUsersState: ({
    userObj,
  }: {
    [key: string]: { percentage: number };
  }) => void;
  handleSetRoom: (getRoom: Room) => void;
  handleSetText: (text: string) => void;
}

const ContextRoom = createContext<State>({
  users: [],
  usersPlayState: {},
  room: null,
  roomState: ROOM_STATES.WAITING,
  usersCount: 0,
  handleSetUsers: () => {},
  handleSetRoomState: () => {},
  handleSetRoom: () => {},
  handleSetUsersState: () => {},
  handleSetText: () => {},
});

export default function ContextRoomProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [roomState, setRoomState] = useState<RoomStateType>(
    ROOM_STATES.WAITING
  );
  const [usersPlayState, setUsersPlayState] = useState({});
  const [room, setRoom] = useState<(Room & { text: string }) | null>(
    null
  );

  const handleSetUsers = (users: User[]): void => {
    setUsers(users);
  };

  const handleSetRoom = (getRoom: Room) => {
    setRoom((prev) => {
      if (prev) {
        return { ...prev, ...getRoom };
      }
      return { ...getRoom, text: '' };
    });
  };

  const handleSetText = (text: string) => {
    setRoom((prev) => {
      if (prev) {
        return { ...prev, text };
      }
      return null;
    });
  };

  const handleSetRoomState = (room: RoomStateType) => {
    setRoomState(room);
  };

  const handleSetUsersState = (userObj: {
    [key: string]: { percentage: number };
  }): void => {
    setUsersPlayState((prev) => ({ ...prev, ...userObj }));
  };

  const data = {
    users,
    roomState,
    usersPlayState,
    usersCount: users.length,
    handleSetUsers,
    handleSetRoomState,
    handleSetUsersState,
    room,
    handleSetText,
    handleSetRoom,
  };

  return (
    <ContextRoom.Provider value={data}>
      {children}
    </ContextRoom.Provider>
  );
}

export const useContextRoom = () => {
  const context = useContext(ContextRoom);

  if (!context) {
    throw new Error('the context can be use inside of Provider');
  }

  return context;
};
