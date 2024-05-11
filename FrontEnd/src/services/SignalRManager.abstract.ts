import * as signalR from '@microsoft/signalr';
import { urlSocket } from '../constants/url-socket';
import { SocketResponse } from '../type/socket-response';

abstract class SignalRManager {
  private hub1: signalR.HubConnection | null = null;

  protected async connect(path: string = '/Play'): Promise<boolean> {
    this.hub1 = new signalR.HubConnectionBuilder()
      .withUrl(`${urlSocket}${path}`)
      .build();

    try {
      await this.hub1.start();

      this.hub1.on('ClientConnected', () => {
        console.log('server connected');
      });

      return true;
    } catch (error) {
      alert(
        `Error connecting to the server, please try again later.`
      );
      return false;
    }
  }

  protected async send(
    methodName: string,
    ...args: unknown[]
  ): Promise<void> {
    if (
      this.hub1 &&
      this.hub1.state === signalR.HubConnectionState.Connected
    ) {
      try {
        await this.hub1?.send(methodName, ...args);
      } catch (error) {
        console.log(error);
      }
    }
  }

  protected async invoke<T>(
    methodName: string,
    ...args: unknown[]
  ): Promise<SocketResponse<T> | null> {
    try {
      const response = await this.hub1?.invoke(methodName, ...args);
      return response ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  protected async on(
    methodName: string,
    callback: (data: unknown) => void
  ) {
    return this.hub1?.on(methodName, callback);
  }

  protected async off(methodName: string) {
    return this.hub1?.off(methodName);
  }

  public async close(): Promise<void> {
    if (this.hub1) {
      this.hub1.stop();
      this.hub1 = null;
      console.log('close connection');
    }
  }
}

export default SignalRManager;
