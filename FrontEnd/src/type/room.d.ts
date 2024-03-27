import { LANGUAGES } from '../constants';
import { RoomStateType, User } from '.';

export interface Room {
  name: string;
  listUser: User[];
  state: RoomStateType;
  id: string;
  roomType: (typeof LANGUAGES)[keyof typeof LANGUAGES];
}
