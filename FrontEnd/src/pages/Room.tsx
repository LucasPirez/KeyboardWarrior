import Room from '../components/rooms/Room'
import ContextRoomProvider from '../components/rooms/contextRoom'

export default function RoomPage() {
  return (
    <ContextRoomProvider>
      <Room />
    </ContextRoomProvider>
  )
}
