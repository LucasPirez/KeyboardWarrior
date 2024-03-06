import { Button } from 'primereact/button';
import { serviceGame } from '../../services';
import { PATH, SESSION_STORAGE } from '../../constants';
import { navigateTo } from '../../helpers';

interface Props {
  roomId: string;
}

export function BackToRooms({ roomId }: Props) {
  const handleBackToRooms = async () => {
    try {
      const response = await serviceGame.removeUser(
        roomId,
        window.sessionStorage.getItem(SESSION_STORAGE) ?? ''
      );

      if (!response) {
        throw new Error('Some error has ocurred');
      }

      navigateTo({ path: PATH.rooms });
    } catch (error) {
      alert(error);
    }
  };

  return <Button label="Back to Rooms" onClick={handleBackToRooms} />;
}
