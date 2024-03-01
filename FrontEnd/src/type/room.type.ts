import { User } from '.';

export interface Room {
  name: string;
  listUser: User[];
  state: number;
}
