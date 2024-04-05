import { SOCKET_MESSAGES } from '../../constants';
import { serviceGame } from '../../services';
import {
  ToggleButton,
  ToggleButtonChangeEvent,
} from 'primereact/togglebutton';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { IGameService } from '../../services/game.service';

interface Props {
  service?: keyof Pick<IGameService, 'toggleReady'>;
  roomId: string;
  setStateToggle?: (
    socketMessage:
      | typeof SOCKET_MESSAGES.READY
      | typeof SOCKET_MESSAGES.NOT_READY
  ) => void;
  labelStart?: string;
}

export default function ToggleButtonReady({
  service,
  roomId,
  setStateToggle,
  labelStart,
}: Props) {
  const [toggleButton, setToggleButton] = useState(false);
  const { userName } = useUser();

  const handleToggleState = async (e: ToggleButtonChangeEvent) => {
    const { value } = e.target;
    setToggleButton(value);

    const socketMessage = value
      ? SOCKET_MESSAGES.READY
      : SOCKET_MESSAGES.NOT_READY;

    setStateToggle && setStateToggle(socketMessage);

    service &&
      (await serviceGame[service]({
        userName: userName ?? '',
        roomId,
        socketMessage,
      }));
  };

  return (
    <ToggleButton
      onLabel="I Ready"
      offLabel={labelStart ? labelStart : 'I Not Ready'}
      checked={toggleButton}
      pt={{
        root: {
          style: {
            background: `${
              toggleButton
                ? 'var(--highlight-bg)'
                : 'var(--focus-ring)'
            }`,
          },
        },
      }}
      onChange={handleToggleState}
    />
  );
}
