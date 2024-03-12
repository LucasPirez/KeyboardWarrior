import { SESSION_STORAGE, SOCKET_MESSAGES } from '../../constants';
import { serviceGame } from '../../services';
import {
  ToggleButton,
  ToggleButtonChangeEvent,
} from 'primereact/togglebutton';
import { useState } from 'react';
import { useContextRoom } from '../rooms/contextRoom';

export default function ToggleButtonReady() {
  const [toggleButton, setToggleButton] = useState(false);
  const { room } = useContextRoom();

  const handleToggleState = async (e: ToggleButtonChangeEvent) => {
    const { value } = e.target;
    setToggleButton(value);

    const userName =
      window.sessionStorage.getItem(SESSION_STORAGE) ?? 'a';

    const socketMessage = value
      ? SOCKET_MESSAGES.READY
      : SOCKET_MESSAGES.NOT_READY;

    await serviceGame.toggleReady({
      userName,
      roomId: room?.id ?? '',
      socketMessage,
    });
  };

  return (
    <ToggleButton
      onLabel="I Ready"
      offLabel="I Not Ready"
      checked={toggleButton}
      onChange={handleToggleState}
    />
  );
}
