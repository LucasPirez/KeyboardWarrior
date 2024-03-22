import { Badge } from 'primereact/badge';
import { useEffect, useState } from 'react';
import { serviceGame } from '../../services';
import { SOCKET_MESSAGES } from '../../constants';
import { FinishGameData } from '../../type';
import { Button } from 'primereact/button';

import styles from './TablePosition.module.css';
import 'primeicons/primeicons.css';
import { useUser } from '../../hooks/useUser';

type Position = { userName: string; position: number };

export default function TablePosition() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [showInModal, setShowInModal] = useState<boolean>(false);
  const { userName: userNameStorage } = useUser();

  useEffect(() => {
    (async () => {
      await serviceGame.listen(
        SOCKET_MESSAGES.FINISH_GAME,
        (data) => {
          const dataTyped = data as FinishGameData;
          const [userName, timesStamp] = dataTyped.split('-');
          const newPosition: Position = {
            userName,
            position: parseInt(timesStamp),
          };

          if (userName === userNameStorage) setShowInModal(true);

          setPositions((prev) => {
            const newOrder = [...prev, newPosition].sort((a, b) => {
              return a.position - b.position;
            });
            return newOrder;
          });
        }
      );
    })();

    return () => {
      serviceGame.removeListen(SOCKET_MESSAGES.FINISH_GAME);
    };
  }, []);

  const severity: Record<number, 'success' | 'warning' | 'info'> = {
    0: 'success',
    1: 'info',
    2: 'warning',
  };

  return (
    <section
      className={`${styles.container} ${
        !showInModal ? styles.normalContainer : styles.modalContainer
      }`}>
      <div className={styles.headerContainer}>
        <h2>POSITION</h2>

        {showInModal && (
          <Button
            icon="pi pi-times"
            rounded
            severity="danger"
            aria-label="Cancel"
            onClick={() => setShowInModal(false)}
          />
        )}
      </div>
      {positions.map((position, index) => {
        if (index > Object.keys(severity).length - 1) {
          return;
        }
        return (
          <>
            <div
              key={'tablePosition--' + position.userName}
              className={styles.containerNames}>
              <Badge
                className={styles.badge}
                value={index + 1}
                size={'normal'}
                severity={severity[index]}
              />
              <span className={styles.userName}>
                {position.userName}
              </span>
            </div>
          </>
        );
      })}
    </section>
  );
}
