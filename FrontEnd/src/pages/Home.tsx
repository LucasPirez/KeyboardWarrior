import { CreateRoom } from '../components/create-room'
import Room from '../components/InfoRoom'
import SelectPractice from '../components/SelectPractice'

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
  )
}
