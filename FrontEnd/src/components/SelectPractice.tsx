import { useState } from 'react';
import { DropDown } from './create-room';
import { type RoomType } from '../type';
import { LANGUAGES, PATH } from '../constants';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import styles from '../components/create-room/createRoom.module.css';
import { navigateTo } from '../helpers';

export default function SelectPractice() {
  const [roomType, setRoomType] = useState<RoomType['RoomType']>(
    LANGUAGES.NORMAL_TEXT
  );

  const handleChange = (event: DropdownChangeEvent) => {
    const { value } = event.target;

    setRoomType(value.name);
  };

  const handleClick = () => {
    navigateTo({
      path: PATH.practice,
      query: { roomType },
    });
  };

  return (
    <div className={styles.container}>
      <DropDown roomValue={roomType} handleChange={handleChange} />
      <Button
        label="Practice"
        outlined
        type="button"
        onClick={handleClick}
      />
    </div>
  );
}
