import { io, Socket as IOSocket } from 'socket.io-client';

interface ServerToClientEvents {
  hello: (data: string) => void;
}

interface ClientToServerEvents {
  hello: (data: string) => void;
}

export class Socket {
  private socket: IOSocket<ServerToClientEvents, ClientToServerEvents>;

  constructor(url: string) {
    this.socket = io(url, {
      transports: ['websocket'],
      path: '/api/socket',
    });
  }

  disconnect() {
    this.socket.disconnect();

    return this;
  }

  public onDisconnect(cb: (reason: string, description: unknown) => void) {
    this.socket.on('disconnect', cb);

    return this;
  }

  public onConnect(cb: (socket: this) => void) {
    this.socket.on('connect', () => cb(this));

    return this;
  }

  public onHello(cb: (data: string, socket: this) => void) {
    this.socket.on('hello', (data) => cb(data, this));

    return this;
  }

  public hello(data: string) {
    this.socket.emit('hello', data);

    return this;
  }
}

export const socket = (url: string) => new Socket(url);
