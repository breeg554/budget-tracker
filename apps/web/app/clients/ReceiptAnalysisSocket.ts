import { Socket, SocketArgs } from '~/clients/Socket';
import { assert } from '~/utils/assert';

type ListenEvents = {};

type EmitEvents = {
  run: (id: string, cb: (runId: string) => void) => void;
  push: (body: { room: string; data: string }) => void;
};

export class ReceiptAnalysisSocket extends Socket<ListenEvents, EmitEvents> {
  public roomId: string | null = null;

  constructor(url: string, args?: SocketArgs) {
    super(url, args);
  }

  public run(id: string) {
    this.socket.emit('run', id, (runId: string) => {
      this.roomId = runId;
    });

    return this;
  }

  public push(data: string) {
    assert(this.roomId, 'Room not initialized');

    this.socket.emit('push', { room: this.roomId, data });
  }
}

export const receiptAnalysisSocket = (url: string, args?: SocketArgs) =>
  new ReceiptAnalysisSocket(url, args);
