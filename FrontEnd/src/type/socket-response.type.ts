export interface SocketResponse<T> {
  data: T;
  message: string;
  code: number;
}
