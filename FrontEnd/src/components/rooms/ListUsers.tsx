import { ProgressBar } from 'primereact/progressbar';
import { useContextRoom } from './contextRoom';
import { useEffect } from 'react';
import { serviceGame } from '../../services';
import { SOCKET_MESSAGES } from '../../constants/socket-messages';
import { useUser } from '../../hooks/useUser';

import styles from './listUser.module.css';

interface Props {
  percentageUser: number;
}

export default function ListUsers({ percentageUser }: Props) {
  const { users, usersPlayState, handleSetUsersState } =
    useContextRoom();
  const { userName } = useUser();

  useEffect(() => {
    serviceGame.listen(
      SOCKET_MESSAGES.TEXT_TYPED_PERCENTAGE,
      (...data) => {
        const d = [...data];

        handleSetUsersState({
          [d[0] as string]: { percentage: d[1] as number },
        });
      }
    );

    serviceGame.listen(
      SOCKET_MESSAGES.CHANGE_STATE_USER,
      (...data) => {
        const d = [...data];

        handleSetUsersState({
          [d[0] as string]: {
            ready: d[1] as boolean,
          },
        });
      }
    );

    return () => {
      serviceGame.removeListen(SOCKET_MESSAGES.TEXT_TYPED_PERCENTAGE);
      serviceGame.removeListen(SOCKET_MESSAGES.CHANGE_STATE_USER);
    };
  }, []);

  console.log(usersPlayState);

  return (
    <>
      {users.map((user, index) => (
        <div key={user?.id}>
          <p
            style={{
              color: `${
                user?.userName === userName && 'var(--primary-color)'
              }`,
            }}
            className={styles.container}>
            <span className={styles.player}> # {index + 1}:</span>
            <span> {user?.userName}</span>
            <span>
              {' '}
              {usersPlayState[user?.userName]?.ready || user.ready ? (
                <i
                  className="pi pi-check"
                  style={{ color: 'var(--green-300)' }}></i>
              ) : (
                ''
              )}
            </span>
          </p>
          <ProgressBar
            style={{
              height: '23px',
              minWidth: '230px',
            }}
            pt={{
              root: {
                style: { background: 'var(--gray-600)' },
              },
            }}
            value={
              user?.userName === userName
                ? percentageUser
                : usersPlayState[user?.userName]?.percentage ?? 0
            }
          />
        </div>
      ))}
    </>
  );
}
