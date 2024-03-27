import { SOCKET_MESSAGES, cpmWpm } from '../../constants';
import Timer from '../Timer';
import ToggleButtonReady from '../buttons/ToggleButtonReady';
import { useEffect, useState } from 'react';
import styles from '../../components/rooms/textContainer.module.css';
import stylesLocal from './containerTypingPractice.module.css';

import TypingVisualization from '../TypingVisualization';
import { serviceGame } from '../../services';
import { ShowResult } from '../show-result';

interface Props {
  handleSetPercentage: (percentage: number) => void;
}

export default function ContainerTypingPractice({
  handleSetPercentage,
}: Props) {
  const [text, setText] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<
    | typeof SOCKET_MESSAGES.READY
    | typeof SOCKET_MESSAGES.NOT_READY
    | 'start'
  >(SOCKET_MESSAGES.NOT_READY);

  const handleFinishTimer = () => {
    setRoomState('start');
  };

  useEffect(() => {
    serviceGame.listen(SOCKET_MESSAGES.GET_TEXT_PRACTICE, (data) => {
      setText(data as string);
    });

    return () => {
      serviceGame.removeListen(SOCKET_MESSAGES.GET_TEXT_PRACTICE);
    };
  }, []);

  const setPercentage = (percentage: number) => {
    handleSetPercentage(percentage);

    if (percentage === 100) {
      setRoomState(SOCKET_MESSAGES.NOT_READY);
    }
  };

  const buttonComponent = (
    <ToggleButtonReady
      service={'getTextPractice'}
      roomId="practice"
      setStateToggle={setRoomState}
      labelStart="Start"
    />
  );

  const RenderDic = {
    start: (
      <>
        {text && (
          <TypingVisualization
            handleSetPercentage={setPercentage}
            textReceived={text}
          />
        )}
      </>
    ),
    [SOCKET_MESSAGES.READY]: <Timer finish={handleFinishTimer} />,
    [SOCKET_MESSAGES.NOT_READY]: <>{buttonComponent}</>,
  };

  return (
    <article
      className={`${styles.container} ${stylesLocal.container}`}>
      {RenderDic[roomState]}
    </article>
  );
}
