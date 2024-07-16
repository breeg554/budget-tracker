import {
  BuildelRunStatus,
  BuildelSocket as OriginalBuildelSocket,
} from '@buildel/buildel';

type RunHandlers = {
  onBlockOutput?: (
    blockId: string,
    outputName: string,
    payload: unknown,
  ) => void;
  onError?: (error: string) => void;
  onBlockError?: (blockId: string, errors: string[]) => void;
  onBlockStatusChange?: (blockId: string, isWorking: boolean) => void;
  onStatusChange?: (status: BuildelRunStatus) => void;
};

export class BuildelSocket {
  private readonly buildelInstance: OriginalBuildelSocket;

  constructor(organizationId: number) {
    this.buildelInstance = new OriginalBuildelSocket(organizationId, {
      authUrl: '/buildel/auth',
    });
  }

  async connect() {
    await this.buildelInstance.connect();
    return this;
  }

  async run(pipelineId: number, handlers?: RunHandlers) {
    return this.buildelInstance.run(pipelineId, {
      onBlockOutput: (
        blockId: string,
        outputName: string,
        payload: unknown,
      ) => {
        handlers?.onBlockOutput?.(blockId, outputName, payload);
        console.log(
          `Output from block ${blockId}, output ${outputName}:`,
          payload,
        );
      },
      onBlockStatusChange: (blockId: string, isWorking: boolean) => {
        handlers?.onBlockStatusChange?.(blockId, isWorking);
        console.log(`Block ${blockId} is ${isWorking ? 'working' : 'stopped'}`);
      },
      onStatusChange: (status: BuildelRunStatus) => {
        handlers?.onStatusChange?.(status);
        console.log(`Status changed: ${status}`);
      },
      onBlockError: (blockId: string, errors: string[]) => {
        handlers?.onBlockError?.(blockId, errors);
        console.log(`Block ${blockId} errors: ${errors}`);
      },
      onError: (error) => {
        handlers?.onError?.(error);
        console.log(`Error: ${error}`);
      },
    });
  }

  async disconnect() {
    await this.buildelInstance.disconnect();

    return this;
  }
}
