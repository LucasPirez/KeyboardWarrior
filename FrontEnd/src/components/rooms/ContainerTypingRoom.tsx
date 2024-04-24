import { useUser } from '../../hooks/useUser';
import WritingVisualization from '../WritingVisualization';
import { useContextRoom } from './contextRoom';
import { serviceGame } from '../../services';
import { Room } from '../../type';
import { PATH } from '../../constants';
import { navigateTo } from '../../helpers';

interface Props {
  handleSetPercentage: (value: number) => void;
  room: Room & {
    text: string;
  };
  handleError?: () => void;
}

export default function ContainerTyping({
  room,
  handleSetPercentage,
  handleError,
}: Props) {
  const { id } = room;
  const { userName } = useUser();
  const { handleSetUserEnd } = useContextRoom();

  const setPercentage = (percentage: number) => {
    handleSetPercentage(percentage);
  };

  function handleIntervalPercentage(percentage: number) {
    serviceGame.percentageTyped(percentage, userName ?? '', id ?? '');
  }

  function handleFinish() {
    serviceGame.finishGame({
      userName: userName ?? '',
      roomId: id,
    });
  }

  async function handleInactiveUser() {
    try {
      handleSetUserEnd(userName ?? '');
      const response = await serviceGame.removeUser(
        id,
        userName ?? ''
      );

      if (!response) {
        throw new Error('Some error has ocurred');
      }

      navigateTo({ path: PATH.rooms });
    } catch (error) {
      alert(error);
    }
  }

  return (
    <WritingVisualization
      handleSetPercentage={setPercentage}
      textReceived={room.text}
      finish={handleFinish}
      inactiveUser={handleInactiveUser}
      intervalPercentage={handleIntervalPercentage}
      isInactive={860}
      handleError={handleError}
    />
  );
}
