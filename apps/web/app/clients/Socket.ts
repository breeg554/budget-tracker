import {
  io,
  Socket as IOSocket,
  ManagerOptions,
  SocketOptions,
} from 'socket.io-client';

export type SocketArgs = Partial<ManagerOptions & SocketOptions>;

export type OnConnectCb = (socket: Socket) => void;
export type OnDisconnectCb = (reason: string, description: unknown) => void;
export type OnConnectErrorCb = (error: Error) => void;

export class Socket<
  S extends Record<string, any> = {},
  C extends Record<string, any> = {},
> {
  private readonly id: string;
  protected socket: IOSocket<S, C>;

  constructor(url: string, args?: SocketArgs) {
    this.socket = io(url, {
      transports: ['websocket'],
      path: '/api/socket',
      autoConnect: false,
      ...args,
    });

    this.id = crypto.randomUUID();
  }

  async connect(): Promise<this> {
    return new Promise(async (resolve, reject) => {
      try {
        const { token } = await this.authSocket();

        this.socket.io.opts.query = {
          token,
        };

        this.socket.connect();

        resolve(this);
      } catch (err) {
        reject(err);
      }
    });
  }

  disconnect(): Promise<this> {
    return new Promise((resolve, reject) => {
      try {
        this.socket.disconnect();
        resolve(this);
      } catch (err) {
        reject(err);
      }
    });
  }

  public onConnectError(cb: OnConnectErrorCb) {
    this.socket.on('connect_error', cb);

    return this;
  }

  public onDisconnect(cb: OnDisconnectCb) {
    this.socket.on('disconnect', cb);

    return this;
  }

  public onConnect(cb: OnConnectCb) {
    this.socket.on('connect', () => cb(this));

    return this;
  }

  get connected() {
    return this.socket.connected;
  }

  private async authSocket() {
    const res = await fetch('/auth-token', {
      method: 'post',
      body: JSON.stringify({ socketId: this.id }),
    });

    if (!res.ok) throw new Error('Failed to authenticate socket');

    return res.json();
  }
}

export const socket = (url: string, args?: SocketArgs) => new Socket(url, args);
