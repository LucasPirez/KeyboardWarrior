import { ProgressBar } from 'primereact/progressbar';
import { useContextRoom } from './contextRoom';
import { useEffect } from 'react';
import { serviceGame } from '../../services';
import { SOCKET_MESSAGES } from '../../constants/socket-messages';
import { useUser } from '../../hooks/useUser';

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

    return () => {
      serviceGame.removeListen(SOCKET_MESSAGES.TEXT_TYPED_PERCENTAGE);
    };
  }, []);

  return (
    <article style={{ background: '' }}>
      {users.map((user, index) => (
        <div
          key={user?.id}
          style={{
            minWidth: '200px',
            maxWidth: '400px',
          }}>
          <p
            style={{
              color: `${
                user?.userName === userName && 'var(--primary-color)'
              }`,
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}>
            <small
              style={{
                color: 'var(--text-color)',
              }}>
              player #{index + 1}:{' '}
            </small>{' '}
            {user?.userName}
          </p>
          <ProgressBar
            style={{
              height: '30px',
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
    </article>
  );
}
