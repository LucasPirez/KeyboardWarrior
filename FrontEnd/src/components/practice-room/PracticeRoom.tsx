import { useEffect, useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import ContainerTypingPractice from './ContainerTypingPractice';

import styles from './practice.module.css';
import { RoomType } from 'src/type';
import { BackToRooms } from '../buttons';

export default function PracticeRoom() {
  const [percentage, setPercentage] = useState(0);
  const [roomType, setRoomType] = useState<
    RoomType['RoomType'] | null
  >(null);

  const handleSetPercentage = (value: number) => {
    setPercentage(value);
  };

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(
        window.location.hash.split('?')[1]
      );
      const roomType = urlParams.get('roomType') as
        | RoomType['RoomType']
        | null;

      setRoomType(roomType);
    })();
  }, []);

  return (
    <section className={styles.container}>
      <BackToRooms className={styles.buttonBackRooms} />
      <div>
        <span>Progress</span>
        <ProgressBar
          style={{
            height: '30px',
            minWidth: '200px',
            width: '400px',
            display: 'inline-block',
            verticalAlign: 'top',
            marginLeft: '20px',
          }}
          pt={{
            root: {
              style: {
                background: 'var(--gray-600)',
              },
            },
          }}
          value={percentage}
        />
      </div>

      {roomType && (
        <ContainerTypingPractice
          handleSetPercentage={handleSetPercentage}
          roomType={roomType}
        />
      )}
    </section>
  );
}
