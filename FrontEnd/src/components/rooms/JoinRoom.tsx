import { Button } from 'primereact/button';
import { serviceGame } from '../../services';
import { PATH, SESSION_STORAGE } from '../../constants';
import { navigateTo } from '../../helpers';

interface Props {
  roomId: string;
}

export default function JoinRoom({ roomId }: Props) {
  const handleClick = async () => {
    const userName = window.sessionStorage.getItem(SESSION_STORAGE);

    if (userName !== null) {
      const response = await serviceGame.joinRoom(roomId, userName);

      if (response.code !== 200) {
        throw new Error(response.message);
      }

      navigateTo({
        path: PATH.game,
        query: { id: roomId },
      });
    }
  };

  return <Button label="Join to Room" raised onClick={handleClick} />;
}
