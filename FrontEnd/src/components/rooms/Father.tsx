import RoomPage from './RoomPage';
import ContextRoomProvider from './contextRoom';

export default function Father() {
  return (
    <ContextRoomProvider>
      <RoomPage />
    </ContextRoomProvider>
  );
}
