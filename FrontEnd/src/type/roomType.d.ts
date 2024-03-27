import { CREATE_ROOM_STATE, LANGUAGES } from '../constants';

export interface RoomType {
  [CREATE_ROOM_STATE.ROOM_NAME]: string;
  [CREATE_ROOM_STATE.ROOM_TYPE]: (typeof LANGUAGES)[keyof typeof LANGUAGES];
}
