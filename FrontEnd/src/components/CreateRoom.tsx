import { Button } from 'primereact/button';
import { serviceGame } from '../services';
import {
  CREATE_ROOM_STATE,
  LANGUAGES,
  PATH,
  SESSION_STORAGE,
} from '../constants';
import { navigateTo } from '../helpers';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ChangeEvent, FormEvent, useState } from 'react';
import { RoomType } from '@/type';

import styles from './createRoom.module.css';

const { ROOM_NAME, ROOM_TYPE } = CREATE_ROOM_STATE;

export default function CreateRoom() {
  const [roomValue, setRoomValue] = useState<RoomType>({
    [ROOM_NAME]: '',
    [ROOM_TYPE]: LANGUAGES.NORMAL_TEXT,
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await serviceGame.createRoom(
        window.sessionStorage.getItem(SESSION_STORAGE) ?? '',
        roomValue[ROOM_NAME],
        roomValue[ROOM_TYPE]
      );

      const userName = window.sessionStorage.getItem(SESSION_STORAGE);
      if (!userName) return;

      navigateTo({
        path: PATH.game,
        query: { id: response.data.id, userName },
      });
    } catch (error) {
      alert(error);
    }
  };

  const handleChange = (
    event: DropdownChangeEvent | ChangeEvent<HTMLInputElement>
  ) => {
    const { value, name } = event.target;
    const stateValue = value?.name ? value.name : value;

    setRoomValue((prev) => ({
      ...prev,
      [name]: stateValue,
    }));
  };

  const options = Object.values(LANGUAGES).map((language) => ({
    name: language,
  }));

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <InputText
        placeholder="Room Name"
        name={ROOM_NAME}
        onChange={handleChange}
      />
      <Dropdown
        onChange={handleChange}
        optionLabel="name"
        name={ROOM_TYPE}
        options={options}
        value={{ name: roomValue[ROOM_TYPE] }}
        placeholder={LANGUAGES.NORMAL_TEXT}
      />
      <Button
        label="Create Room"
        outlined
        type="submit"
        disabled={roomValue[ROOM_NAME]?.length > 4 ? false : true}
      />
    </form>
  );
}
