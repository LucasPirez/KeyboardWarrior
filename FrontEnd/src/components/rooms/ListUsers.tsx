import { ProgressBar } from 'primereact/progressbar';
import { useContextRoom } from './contextRoom';
import { SESSION_STORAGE } from '../../constants';
import { useEffect } from 'react';
import { serviceGame } from '../../services';
import { SOCKET_MESSAGES } from '../../constants/socket-messages';

interface Props {
  percentageUser: number;
}

export default function ListUsers({ percentageUser }: Props) {
  const { users, usersPlayState, handleSetUsersState } =
    useContextRoom();

  const username = window.sessionStorage.getItem(SESSION_STORAGE);

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
    <article>
      {users.map((user, index) => (
        <div key={user.id}>
          <h3>
            <small>player #{index + 1}: </small> {user.userName}
          </h3>
          <ProgressBar
            style={{
              height: '30px',
              minWidth: '200px',
              width: '400px',
            }}
            value={
              user.userName === username
                ? percentageUser
                : usersPlayState[user.userName]?.percentage ?? 0
            }
          />
        </div>
      ))}
    </article>
  );
}
