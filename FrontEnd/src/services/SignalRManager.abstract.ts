import * as signalR from '@microsoft/signalr';
import { urlSocket } from '../constants/url-socket';

abstract class SignalRManager {
  protected server: signalR.HubConnection | null = null;

  async connect(path: string = '/Play'): Promise<void> {
    this.server = new signalR.HubConnectionBuilder()
      .withUrl(`${urlSocket}${path}`)
      .build();

    try {
      await this.server.start();

      this.server.on('ClientConnected', () => {
        console.log('server connected');
      });
    } catch (error) {
      alert(`Error connect to server, ${urlSocket}: ${error}`);
    }
  }

  async send(methodName: string, ...args: unknown[]): Promise<void> {
    if (
      this.server &&
      this.server.state === signalR.HubConnectionState.Connected
    ) {
      try {
        await this.server?.send(methodName, ...args);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async invoke(
    methodName: string,
    ...args: unknown[]
  ): Promise<unknown | null> {
    try {
      const response = await this.server?.invoke(methodName, ...args);
      return response ?? null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  close(): void {
    if (this.server) {
      this.server.stop();
      this.server = null;
      console.log('close connection');
    }
  }
}

export default SignalRManager;
