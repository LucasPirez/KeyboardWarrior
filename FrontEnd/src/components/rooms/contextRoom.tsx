import { serviceGame } from '../../services';
import { ROOM_STATES } from '../../constants';
import { type Room, type RoomStateType, type User } from '../../type';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
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
  usersResult: {
    positions: Position[];
    userEnd: Record<string, boolean>;
    reset: boolean;
  };
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
  handleSetUserEnd: (userName: string) => void;
  handleSetPositions: (position: Position) => void;
  handleResetRoom: (getRoom: Room) => void;
}

const ContextRoom = createContext<State>({
  users: [],
  usersPlayState: {},
  room: null,
  roomState: ROOM_STATES.WAITING,
  usersResult: { positions: [], userEnd: {}, reset: false },
  handleSetUsers: () => {},
  handleSetRoomState: () => {},
  handleSetRoom: () => {},
  handleSetUsersState: () => {},
  handleSetText: () => {},
  handleSetPositions: () => {},
  handleSetUserEnd: () => {},
  handleResetRoom: () => {},
});
type Position = { userName: string; position: number };

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
  const [usersResult, setUsersResult] = useState<{
    positions: Position[];
    userEnd: Record<string, boolean>;
    reset: boolean;
  }>({ positions: [], userEnd: {}, reset: false });

  useEffect(() => {
    const arr = Object.entries(usersResult.userEnd);
    const isUsersEnd = arr.filter(([, bool]) => bool === false);

    (async () => {
      if (isUsersEnd.length === 0) {
        await serviceGame.restartRoom({ roomId: room?.id ?? '' });
      }
    })();
  }, [usersResult.userEnd]);

  const handleSetUsers = (usersParam: User[]): void => {
    setUsers(usersParam);

    setUsersResult((prev) => ({
      positions: prev.positions,
      userEnd: {},
      reset: true,
    }));

    usersParam.forEach((user) =>
      setUsersResult((prev) => ({
        ...prev,
        userEnd: { ...prev.userEnd, [user.userName]: false },
      }))
    );
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

  const handleSetUserEnd = (userName: string) => {
    setUsersResult((prev) => ({
      ...prev,
      userEnd: { ...prev.userEnd, [userName]: true },
    }));
  };

  const handleSetPositions = (position: Position) => {
    if (!usersResult.reset) {
      setUsersResult((prev) => {
        const newOrder = [...prev.positions, position].sort(
          (a, b) => {
            return a.position - b.position;
          }
        );
        return { ...prev, positions: newOrder };
      });
    } else {
      setUsersResult((prev) => {
        return { ...prev, positions: [position], reset: false };
      });
    }
  };

  const handleResetRoom = (getRoom: Room) => {
    handleSetUsers(getRoom.listUser);
    handleSetRoom(getRoom);
    handleSetRoomState(ROOM_STATES.WAITING);

    getRoom.listUser.forEach((user) =>
      handleSetUsersState({ [user.userName]: { percentage: 0 } })
    );
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
    usersResult,
    handleSetRoom,
    handleSetUserEnd,
    handleResetRoom,
    handleSetPositions,
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
