import { SOCKET_MESSAGES } from '../constants/socket-messages';
import { Room, RoomType, SocketResponse } from '../type';
import SignalRManager from './SignalRManager.abstract';

export interface IGameService {
  connectGame(): Promise<boolean>;
  login(userName: string): Promise<boolean>;
  listen(methodName: string, callback: (data: unknown) => void): void;
  removeListen(methodName: string): void;
  createRoom(
    userName: string,
    roomName: string,
    roomTextType: string
  ): Promise<SocketResponse<Room>>;
  getRooms(): Promise<SocketResponse<Room[]> | null>;
  getRoom(id: string): Promise<SocketResponse<Room> | null>;
  joinRoom(
    roomId: string,
    userName: string
  ): Promise<SocketResponse<Room> | null>;
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
  getTextPractice(
    roomType: RoomType['RoomType']
  ): Promise<SocketResponse<string> | null>;
}

export class GameService
  extends SignalRManager
  implements IGameService
{
  async connectGame(): Promise<boolean> {
    return this.connect('/Play');
  }

  async login(userName: string): Promise<boolean> {
    const data = await this.invoke<boolean>(
      SOCKET_MESSAGES.LOGIN,
      userName
    );

    return data?.data ?? false;
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
    try {
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
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getRooms(): Promise<SocketResponse<Room[]> | null> {
    const response = await this.invoke<Room[]>(
      SOCKET_MESSAGES.GET_ROOMS
    );

    return response ?? null;
  }

  async getRoom(id: string): Promise<SocketResponse<Room> | null> {
    const response = await this.invoke<Room>(
      SOCKET_MESSAGES.GET_ROOM,
      id
    );

    return response ?? null;
  }

  async joinRoom(
    roomId: string,
    userName: string
  ): Promise<SocketResponse<Room> | null> {
    const response = await this.invoke<Room>(
      SOCKET_MESSAGES.JOIN_ROOM,
      roomId,
      userName
    );

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

    if (response?.code === 200) return true;

    return false;
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

    if (response?.code === 200) return true;

    return false;
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
  ): Promise<SocketResponse<string> | null> {
    return await this.invoke<string>(
      SOCKET_MESSAGES.GET_TEXT_PRACTICE,
      roomType
    );
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
