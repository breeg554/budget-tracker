import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayEncryptionService } from '~/modules/gateways/gateway-encryption.service';
import { ReceiptProducer } from '~/modules/queue/producers/receipt.producer';
import { ReceiptProcessEvent } from '~/modules/organization/receipt/events/receipt-process.event';
import { GetProcessedReceiptProductsDto } from '~/dtos/receipt/get-processed-receipt.dto';
import { ReceiptProcessStatus } from '~/modules/organization/receipt/enums/receipt-process.enum';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ReceiptGateway {
  @WebSocketServer() server: Server;

  constructor(
    private gatewayEncryptionService: GatewayEncryptionService,
    private receiptProducer: ReceiptProducer,
  ) {}

  @SubscribeMessage('run')
  async handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody('fileUrl') fileUrl: string,
    @MessageBody('organizationName') organizationName: string,
    @MessageBody('secretName') secretName: string,
  ): Promise<string> {
    const roomId = this.gatewayEncryptionService.encrypt(
      `${organizationName}:${secretName}:${fileUrl}`,
    );

    client.join(roomId);

    await this.receiptProducer.addReceiptProcessJob(
      new ReceiptProcessEvent({
        fileUrl,
        organizationName,
        secretName,
        roomId,
      }),
    );

    return roomId;
  }

  processImage(roomId: string) {
    this.statusChange(roomId, ReceiptProcessStatus.IMAGE_PROCESSING);
  }

  processContent(roomId: string) {
    this.statusChange(roomId, ReceiptProcessStatus.CONTENT_PROCESSING);
  }

  errorProcessing(roomId: string, error: Error) {
    this.server.to(roomId).emit('errorProcessing', { message: error.message });
    this.processError(roomId);
  }

  private processError(roomId: string) {
    this.statusChange(roomId, ReceiptProcessStatus.ERROR);
  }

  finishProcessing(roomId: string, data: GetProcessedReceiptProductsDto) {
    this.server.to(roomId).emit('finishProcessing', data);
    this.processDone(roomId);
  }

  private processDone(roomId: string) {
    this.statusChange(roomId, ReceiptProcessStatus.DONE);
  }

  private statusChange(roomId: string, status: string) {
    this.server.to(roomId).emit('statusChange', status);
  }
}
