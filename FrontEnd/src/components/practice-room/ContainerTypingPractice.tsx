import { LANGUAGES, SOCKET_MESSAGES } from '../../constants';
import Timer from '../Timer';
import ToggleButtonReady from '../buttons/ToggleButtonReady';
import { useEffect, useRef, useState } from 'react';
import stylesLocal from './containerTypingPractice.module.css';
import WritingVisualization from '../WritingVisualization';
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
    serviceGame.listen(SOCKET_MESSAGES.GET_TEXT_PRACTICE, (data) => {
      setText(data as string);
      handleSetPercentage(0);
    });

    return () => {
      serviceGame.removeListen(SOCKET_MESSAGES.GET_TEXT_PRACTICE);
    };
  }, []);

  const setPercentage = (percentage: number) => {
    handleSetPercentage(percentage);

    if (percentage === 100) {
      setRoomState(SOCKET_MESSAGES.NOT_READY);
      refTimeWriting.current.end = new Date().getTime();
      setShowResult(true);
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
            language={LANGUAGES.NORMAL_TEXT}
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
