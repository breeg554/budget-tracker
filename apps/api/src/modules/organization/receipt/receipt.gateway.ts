import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class ReceiptGateway {
  @SubscribeMessage('hello')
  handleEvent(@MessageBody() data: string): WsResponse<string> {
    return { event: 'hello', data };
  }
}
