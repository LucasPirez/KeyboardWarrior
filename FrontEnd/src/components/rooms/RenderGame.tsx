import { ToggleButtonReady } from '../buttons';
import { useContextRoom } from './contextRoom';
import { PATH, ROOM_STATES } from '../../constants';
import Timer from '../Timer';
import { navigateTo } from '../../helpers';
import ContainerTyping from './ContainerTypingRoom';
import { useEffect, useState } from 'react';
import { TimeWriting } from 'src/type';
import { ShowResult } from '../show-result';

interface Props {
  handleSetPercentage: (value: number) => void;
  refError: number;
  refTimeTyping: TimeWriting;
  handleMutableError: () => void;
}

export default function RenderGame({
  handleSetPercentage,
  refError,
  refTimeTyping,
  handleMutableError,
}: Props) {
  const { roomState, room } = useContextRoom();
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    if (roomState === ROOM_STATES.PLAYING) {
      setShowResult(false);
      refTimeTyping.start = new Date().getTime();
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
      refTimeTyping.end = new Date().getTime();
      setShowResult(true);
    }
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
                refTimeTyping.end - refTimeTyping.start
              }
              errors={refError}
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
            timeMilliseconds={refTimeTyping.end - refTimeTyping.start}
            errors={refError}
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
