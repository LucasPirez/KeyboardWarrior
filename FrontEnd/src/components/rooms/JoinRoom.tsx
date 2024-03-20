import { Button } from 'primereact/button';
import { PATH, SESSION_STORAGE } from '../../constants';
import { navigateTo } from '../../helpers';

interface Props {
  roomId: string;
  disabled?: boolean;
  className?: string;
}

export default function JoinRoom({
  roomId,
  disabled = false,
  className,
}: Props) {
  const handleClick = async () => {
    const userName = window.sessionStorage.getItem(SESSION_STORAGE);

    if (userName !== null) {
      navigateTo({
        path: PATH.game,
        query: { id: roomId, userName },
      });
    }
  };

  return (
    <Button
      label="Join to Room"
      raised
      className={className}
      onClick={handleClick}
      disabled={disabled}
    />
  );
}
