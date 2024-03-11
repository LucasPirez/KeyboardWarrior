import { ROOM_STATES } from '@/constants';

export type RoomStateType =
  (typeof ROOM_STATES)[keyof typeof ROOM_STATES];
