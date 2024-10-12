import { Socket, SocketArgs } from '~/clients/Socket';

export class TestSocket extends Socket<
  { hello: (data: any) => void },
  { hello: (data: any) => void }
> {
  constructor(url: string, args?: SocketArgs) {
    super(url, args);
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

export const testSocket = (url: string, args?: SocketArgs) =>
  new TestSocket(url, args);
