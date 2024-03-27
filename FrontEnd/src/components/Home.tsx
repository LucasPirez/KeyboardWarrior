import CreateRoom from './create-room/CreateRoom';
import Room from './InfoRoom';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
      }}>
      <CreateRoom />
      <Room />
    </div>
  );
}
