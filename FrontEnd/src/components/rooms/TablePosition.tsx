import { Badge } from 'primereact/badge';

import styles from './TablePosition.module.css';
import { useEffect, useState } from 'react';
import { serviceGame } from '../../services';
import { SOCKET_MESSAGES } from '../../constants';
import { FinishGameData } from '../../type';

type Position = { userName: string; position: number };

export default function TablePosition() {
  const [positions, setPositions] = useState<Position[]>([]);

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
    <section className={styles.container}>
      <h2>Position</h2>
      {positions.map((position, index) => {
        if (index > Object.keys(severity).length - 1) {
          return;
        }
        return (
          <div>
            <Badge
              className={styles.badge}
              value={index + 1}
              size={'normal'}
              severity={severity[index]}
            />
            <span>{position.userName}</span>
          </div>
        );
      })}
    </section>
  );
}
