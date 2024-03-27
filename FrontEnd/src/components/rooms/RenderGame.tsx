import styles from './textContainer.module.css';
import ToggleButtonReady from '../buttons/ToggleButtonReady';
import { useContextRoom } from './contextRoom';
import { PATH, ROOM_STATES } from '../../constants';
import Timer from '../Timer';
import { navigateTo } from '../../helpers';
import ContainerTyping from './ContainerTypingRoom';

interface Props {
  handleSetPercentage: (value: number) => void;
}

export default function RenderGame({ handleSetPercentage }: Props) {
  const { roomState, room } = useContextRoom();

  if (!room) {
    navigateTo({
      path: PATH.rooms,
    });
    return;
  }

  const RenderDic = {
    [ROOM_STATES.PLAYING]:
      room && room.text ? (
        <ContainerTyping
          handleSetPercentage={handleSetPercentage}
          room={room}
        />
      ) : (
        ''
      ),
    [ROOM_STATES.TIMER]: <Timer />,
    [ROOM_STATES.WAITING]: (
      <ToggleButtonReady service={'toggleReady'} roomId={room?.id} />
    ),
  };

  return (
    <article className={styles.container}>
      {RenderDic[roomState]}
    </article>
  );
}
