import styles from './textContainer.module.css';
import TextToType from './TextToType';
import ToggleButtonReady from '../buttons/ToggleButtonReady';
import { useContextRoom } from './contextRoom';
import { ROOM_STATES } from '../../constants';
import Timer from '../Timer';

interface Props {
  handleSetPercentage: (value: number) => void;
}

export default function RenderGame({ handleSetPercentage }: Props) {
  const { roomState, room } = useContextRoom();

  const RenderDic = {
    [ROOM_STATES.PLAYING]:
      room && room.text ? (
        <TextToType
          handleSetPercentage={handleSetPercentage}
          room={room}
        />
      ) : (
        ''
      ),
    [ROOM_STATES.TIMER]: <Timer />,
    [ROOM_STATES.WAITING]: <ToggleButtonReady />,
  };

  return (
    <article className={styles.container}>
      {RenderDic[roomState]}
    </article>
  );
}
