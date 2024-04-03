import {
  CREATE_ROOM_STATE,
  DIC_COLORS,
  LANGUAGES,
} from '../../constants';
import { RoomType } from '../../type';
import {
  Dropdown as DropDownPrime,
  DropdownChangeEvent,
} from 'primereact/dropdown';

interface Props {
  handleChange: (event: DropdownChangeEvent) => void;
  roomValue: RoomType['RoomType'];
}

const { ROOM_TYPE } = CREATE_ROOM_STATE;

export default function DropDown({ handleChange, roomValue }: Props) {
  const options = Object.values(LANGUAGES).map((language) => ({
    name: language,
  }));

  const template = (value: { name: RoomType['RoomType'] }) => {
    const { name } = value;

    const color = DIC_COLORS[name];

    return (
      <>
        <span style={{ color }}>{name}</span>
      </>
    );
  };

  return (
    <DropDownPrime
      onChange={handleChange}
      optionLabel="name"
      name={ROOM_TYPE}
      itemTemplate={template}
      options={options}
      value={{ name: roomValue }}
      placeholder={LANGUAGES.NORMAL_TEXT}
    />
  );
}
