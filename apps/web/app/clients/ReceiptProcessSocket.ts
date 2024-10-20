import { ReceiptProcessDto } from '~/api/Receipt/receiptApi.types';
import { Socket, SocketArgs } from '~/clients/Socket';

type RunArgs = {
  organizationName: string;
  fileUrl: string;
  model: 'openai';
};

export type ReceiptProcessStatus =
  | 'idle'
  | 'image-processing'
  | 'content-processing'
  | 'error'
  | 'done';

export type OnStatusChangeCb = (status: ReceiptProcessStatus) => void;
export type OnFinishedProcessingCb = (data: ReceiptProcessDto) => void;
export type OnErrorCb = (error: { message: string }) => void;

export type ReceiptProcessRunCallbacks = {
  onStatusChange: OnStatusChangeCb;
  onFinishedProcessing: OnFinishedProcessingCb;
  onError: OnErrorCb;
};

type ListenEvents = {
  statusChange: OnStatusChangeCb;
  finishProcessing: OnFinishedProcessingCb;
  errorProcessing: OnErrorCb;
};

type EmitEvents = {
  run: (args: RunArgs, cb: (runId: string) => void) => void;
  push: (body: { room: string; data: string }) => void;
};

export class ReceiptProcessSocket extends Socket<ListenEvents, EmitEvents> {
  public roomId: string | null = null;

  constructor(url: string, args?: SocketArgs) {
    super(url, args);
  }

  public run(
    args: Omit<RunArgs, 'model'>,
    callbacks?: Partial<ReceiptProcessRunCallbacks>,
  ) {
    this.socket.emit('run', { ...args, model: 'openai' }, (runId: string) => {
      this.roomId = runId;

      callbacks?.onStatusChange &&
        this.onStatusChange(callbacks.onStatusChange);
      callbacks?.onFinishedProcessing &&
        this.onFinishedProcessing(callbacks.onFinishedProcessing);
      callbacks?.onError && this.onError(callbacks.onError);
    });

    return this;
  }

  public onStatusChange(cb: OnStatusChangeCb) {
    this.socket.on('statusChange', cb);
  }

  public onFinishedProcessing(cb: OnFinishedProcessingCb) {
    this.socket.on('finishProcessing', cb);
  }

  public onError(cb: OnErrorCb) {
    this.socket.on('errorProcessing', cb);
  }
}

export const receiptProcessSocket = (url: string, args?: SocketArgs) =>
  new ReceiptProcessSocket(url, args);
