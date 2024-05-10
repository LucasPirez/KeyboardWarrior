import { ToggleButtonReady } from '../buttons';
import { useContextRoom } from './contextRoom';
import { PATH, ROOM_STATES } from '../../constants';
import Timer from '../Timer';
import { navigateTo } from '../../helpers';
import ContainerTyping from './ContainerTypingRoom';
import { useEffect, useRef, useState } from 'react';
import { TimeWriting } from 'src/type';
import { ShowResult } from '../show-result';

interface Props {
  handleSetPercentage: (value: number) => void;
}

export default function RenderGame({ handleSetPercentage }: Props) {
  const { roomState, room } = useContextRoom();
  const [showResult, setShowResult] = useState<boolean>(false);

  const refError = useRef(0);
  const refTimeTyping = useRef<TimeWriting>({ end: 0, start: 0 });

  useEffect(() => {
    if (roomState === ROOM_STATES.PLAYING) {
      setShowResult(false);
      refTimeTyping.current.start = new Date().getTime();
    }
  }, [roomState]);

  if (!room) {
    navigateTo({
      path: PATH.rooms,
    });
    return;
  }

  const _handleSetPercentage = (percentage: number) => {
    handleSetPercentage(percentage);
    if (percentage === 100) {
      refTimeTyping.current.end = new Date().getTime();
      setShowResult(true);
    }
  };

  const handleMutableError = () => {
    refError.current++;
  };

  const RenderDic = {
    [ROOM_STATES.PLAYING]: room.text ? (
      <>
        <ContainerTyping
          handleSetPercentage={_handleSetPercentage}
          room={room}
          handleError={handleMutableError}
        />
        {showResult && (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'var(--gray-800)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ShowResult
              text={room.text}
              language={room.roomType}
              timeMilliseconds={
                refTimeTyping.current.end -
                refTimeTyping.current.start
              }
              errors={refError.current}
            />
          </div>
        )}
      </>
    ) : (
      ''
    ),
    [ROOM_STATES.TIMER]: <Timer />,
    [ROOM_STATES.WAITING]: (
      <>
        {showResult && (
          <ShowResult
            text={room.text}
            language={room.roomType}
            timeMilliseconds={
              refTimeTyping.current.end - refTimeTyping.current.start
            }
            errors={refError.current}
          />
        )}
        <ToggleButtonReady
          service={'toggleReady'}
          roomId={room?.id}
        />
      </>
    ),
  };

  return <>{RenderDic[roomState]}</>;
}
