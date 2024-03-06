import { Button } from 'primereact/button';
import { serviceGame } from '../services';
import { PATH, SESSION_STORAGE } from '../constants';
import { Room } from '../type';

export default function CreateRoom() {
  const handleClick = async () => {
    try {
      const name = window.prompt('Put Name of Room') ?? 'defaultName';
      const response = await serviceGame.createRoom(
        window.sessionStorage.getItem(SESSION_STORAGE) ?? '',
        name ?? 'defaultName'
      );

      if (!response || response.code !== 200) {
        throw new Error(response?.message);
      }

      const url = `${window.location.origin}/#${PATH.game}?id=${
        (response.data as Room).id
      }`;
      window.location.href = url;
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Button label="Create Room" outlined onClick={handleClick} />
    </>
  );
}
