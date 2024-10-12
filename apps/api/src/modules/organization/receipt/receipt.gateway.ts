import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GatewayEncryptionService } from '~/modules/gateways/gateway-encryption.service';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ReceiptGateway {
  constructor(private gatewayEncryptionService: GatewayEncryptionService) {}

  @SubscribeMessage('run')
  handleEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() id: string,
  ): string {
    const roomId = this.gatewayEncryptionService.encrypt(id);

    client.join(roomId);

    return roomId;
  }

  @SubscribeMessage('push')
  handlePush(
    @ConnectedSocket() client: Socket,
    @MessageBody('room') room: string,
    @MessageBody('data') data: string | Blob,
  ): void {
    const { roomId, userId } = this.gatewayEncryptionService.decrypt(room);

    console.log('handlePush', roomId, userId, data);
  }
}
