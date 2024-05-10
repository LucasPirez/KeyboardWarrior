import { SOCKET_MESSAGES } from '../../constants';
import Timer from '../Timer';
import { ToggleButtonReady } from '../buttons';
import { useEffect, useRef, useState } from 'react';
import stylesLocal from './containerTypingPractice.module.css';
import WritingVisualization from '../WritingVisualization';
import { serviceGame } from '../../services';
import { ShowResult } from '../show-result';
import { RoomType } from '../../type';

interface Props {
  handleSetPercentage: (percentage: number) => void;
  roomType: RoomType['RoomType'];
}

export default function ContainerTypingPractice({
  handleSetPercentage,
  roomType,
}: Props) {
  const [text, setText] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<
    | typeof SOCKET_MESSAGES.READY
    | typeof SOCKET_MESSAGES.NOT_READY
    | 'start'
  >(SOCKET_MESSAGES.NOT_READY);
  const [showResult, setShowResult] = useState<boolean>(false);
  const refErrors = useRef(0);
  const refTimeWriting = useRef<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const handleMutableError = () => {
    refErrors.current++;
  };

  const handleFinishTimer = () => {
    refErrors.current = 0;
    refTimeWriting.current = { end: 0, start: 0 };
    setRoomState('start');
    refTimeWriting.current.start = new Date().getTime();
  };

  useEffect(() => {
    (async () => {
      const response = await serviceGame.getTextPractice(roomType);

      if (!response?.data)
        throw new Error(
          'some error has ocurred, in receive text practice room'
        );

      setText(response?.data);
      handleSetPercentage(0);
    })();
  }, []);

  const setPercentage = (percentage: number) => {
    handleSetPercentage(percentage);

    if (percentage === 100) {
      setRoomState(SOCKET_MESSAGES.NOT_READY);
      refTimeWriting.current.end = new Date().getTime();
      setShowResult(true);
      handleSetPercentage(0);
    }
  };

  const buttonComponent = (
    <ToggleButtonReady
      roomId="practice"
      setStateToggle={setRoomState}
      labelStart="Start"
    />
  );

  const RenderDic = {
    start: (
      <>
        {text && (
          <WritingVisualization
            handleSetPercentage={setPercentage}
            textReceived={text}
            handleError={handleMutableError}
          />
        )}
      </>
    ),
    [SOCKET_MESSAGES.READY]: <Timer finish={handleFinishTimer} />,
    [SOCKET_MESSAGES.NOT_READY]: (
      <>
        {showResult && (
          <ShowResult
            text={text ?? ''}
            errors={refErrors.current}
            language={roomType}
            timeMilliseconds={
              refTimeWriting.current.end -
              refTimeWriting.current.start
            }
          />
        )}
        {buttonComponent}
      </>
    ),
  };

  return (
    <article className={stylesLocal.container}>
      {RenderDic[roomState]}
    </article>
  );
}
