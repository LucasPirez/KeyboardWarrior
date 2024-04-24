import { CreateRoom } from './create-room';
import Room from './InfoRoom';
import SelectPractice from './SelectPractice';

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
      <div
        style={{
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'center',
          gap: 70,
        }}>
        <CreateRoom />
        <SelectPractice />
      </div>
      <Room />
    </div>
  );
}
