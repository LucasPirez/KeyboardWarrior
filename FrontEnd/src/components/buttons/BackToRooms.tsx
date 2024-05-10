import { Button } from 'primereact/button';
import { serviceGame } from '../../services';
import { PATH, SESSION_STORAGE } from '../../constants';
import { navigateTo } from '../../helpers';
import ErrorComponent from '../error';

interface Props {
  roomId?: string;
  className?: string;
}

export function BackToRooms({ roomId, className }: Props) {
  const handleBackToRooms = async () => {
    if (!roomId) return navigateTo({ path: PATH.rooms });
    try {
      navigateTo({ path: PATH.rooms });

      const response = await serviceGame.removeUser(
        roomId,
        window.sessionStorage.getItem(SESSION_STORAGE) ?? ''
      );

      if (!response) {
        throw new Error('Some error has ocurred');
      }
    } catch (error) {
      return <ErrorComponent error={error} />;
    }
  };

  return (
    <Button
      label="Back to Rooms"
      onClick={handleBackToRooms}
      className={className}
    />
  );
}
