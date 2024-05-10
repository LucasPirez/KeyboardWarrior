import { SOCKET_MESSAGES } from '../constants/socket-messages';
import { Room, RoomType, SocketResponse, User } from '../type';
import SignalRManager from './SignalRManager.abstract';

export interface IGameService {
  connectGame(): Promise<boolean>;
  login(userName: string): Promise<User>;
  listen(methodName: string, callback: (data: unknown) => void): void;
  removeListen(methodName: string): void;
  createRoom(
    userName: string,
    roomName: string,
    roomTextType: string
  ): Promise<SocketResponse<Room>>;
  getRooms(): Promise<SocketResponse<Room[]>>;
  getRoom(id: string): Promise<SocketResponse<Room>>;
  joinRoom(
    roomId: string,
    userName: string
  ): Promise<SocketResponse<Room>>;
  removeUser(roomId: string, userName: string): Promise<boolean>;
  percentageTyped(
    percentage: number,
    userName: string,
    roomId: string
  ): Promise<boolean>;
  toggleReady({
    userName,
    roomId,
    socketMessage,
  }: {
    userName: string;
    roomId: string;
    socketMessage:
      | typeof SOCKET_MESSAGES.READY
      | typeof SOCKET_MESSAGES.NOT_READY;
  }): Promise<void>;
  finishGame({
    userName,
    roomId,
  }: {
    userName: string;
    roomId: string;
  }): Promise<void>;
  restartRoom({ roomId }: { roomId: string }): Promise<void>;
  getTextPractice(roomType: RoomType['RoomType']): Promise<string>;
}

export class GameService
  extends SignalRManager
  implements IGameService
{
  async connectGame(): Promise<boolean> {
    return this.connect('/Play');
  }

  async login(userName: string): Promise<User> {
    const response = await this.invoke<User | null>(
      SOCKET_MESSAGES.LOGIN,
      userName
    );

    if (!response?.data || response?.code !== 200) {
      throw new Error(response?.message);
    }

    return response.data;
  }

  async listen(
    methodName: string,
    callback: (data: unknown) => void
  ) {
    this.on(methodName, callback);
  }

  async removeListen(methodName: string) {
    this.off(methodName);
  }

  async createRoom(
    userName: string,
    roomName: string,
    roomTextType: string
  ): Promise<SocketResponse<Room>> {
    const response = await this.invoke<Room>(
      SOCKET_MESSAGES.CREATE_ROOM,
      userName,
      roomName,
      roomTextType
    );

    if (!response) throw new Error(`Unexpected error has ocurred`);

    if (response.code !== 200) {
      throw new Error(`${response.code}, ${response.message}`);
    }

    return response;
  }

  async getRooms(): Promise<SocketResponse<Room[]>> {
    const response = await this.invoke<Room[]>(
      SOCKET_MESSAGES.GET_ROOMS
    );

    if (response?.code !== 200) {
      throw new Error(`${response?.code}, ${response?.message}`);
    }

    return response;
  }

  async getRoom(id: string): Promise<SocketResponse<Room>> {
    const response = await this.invoke<Room>(
      SOCKET_MESSAGES.GET_ROOM,
      id
    );

    if (response?.code !== 200) {
      throw new Error(`${response?.code}, ${response?.message}`);
    }

    return response;
  }

  async joinRoom(
    roomId: string,
    userName: string
  ): Promise<SocketResponse<Room>> {
    const response = await this.invoke<Room>(
      SOCKET_MESSAGES.JOIN_ROOM,
      roomId,
      userName
    );

    if (response?.code !== 200) {
      throw new Error(`${response?.code}, ${response?.message}`);
    }

    return response;
  }

  async removeUser(
    roomId: string,
    userName: string
  ): Promise<boolean> {
    const response = await this.invoke<boolean>(
      SOCKET_MESSAGES.REMOVE_USER,
      roomId,
      userName
    );

    if (response?.code !== 200) {
      throw new Error(`${response?.code}, ${response?.message}`);
    }

    return true;
  }

  async percentageTyped(
    percentage: number,
    userName: string,
    roomId: string
  ): Promise<boolean> {
    const response = await this.invoke(
      SOCKET_MESSAGES.TEXT_TYPED_PERCENTAGE,
      percentage,
      userName,
      roomId
    );

    if (response?.code !== 200) {
      throw new Error(`${response?.code}, ${response?.message}`);
    }

    return true;
  }

  async toggleReady({
    userName,
    roomId,
    socketMessage,
  }: {
    userName: string;
    roomId: string;
    socketMessage:
      | typeof SOCKET_MESSAGES.READY
      | typeof SOCKET_MESSAGES.NOT_READY;
  }): Promise<void> {
    await this.send(socketMessage, userName, roomId);
  }

  async getTextPractice(
    roomType: RoomType['RoomType']
  ): Promise<string> {
    const response = await this.invoke<string | null>(
      SOCKET_MESSAGES.GET_TEXT_PRACTICE,
      roomType
    );

    if (response?.code !== 200 || typeof response.data !== 'string') {
      throw new Error(`${response?.code}, ${response?.message}`);
    }

    return response.data;
  }

  async finishGame({
    userName,
    roomId,
  }: {
    userName: string;
    roomId: string;
  }): Promise<void> {
    const time = new Date().getTime();
    const message = `${userName}-${time}`;
    await this.send(SOCKET_MESSAGES.FINISH_GAME, message, roomId);
  }
  async restartRoom({ roomId }: { roomId: string }): Promise<void> {
    await this.send(SOCKET_MESSAGES.RESTART_ROOM, roomId);
  }
}
