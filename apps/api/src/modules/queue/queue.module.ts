import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bullmq';
import { ExpressAdapter } from '@bull-board/express';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullBoardModule } from '@bull-board/nestjs';
import { QueueAuthMiddleware } from '~/modules/queue/queue.auth-middleware';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QueueNames } from '~/modules/queue/enums/queue-names.enum';
import { ReceiptProducer } from '~/modules/queue/producers/receipt.producer';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redis = configService.get('redis');

        return {
          connection: {
            url: redis.url,
            ttl: redis.ttl,
            password: redis.password,
            family: 6,
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QueueNames.RECEIPT,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    }),
    BullBoardModule.forRoot({
      route: '/bull-board',
      adapter: ExpressAdapter,
      middleware: QueueAuthMiddleware,
    }),
    BullBoardModule.forFeature({
      name: QueueNames.RECEIPT,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [ReceiptProducer],
  exports: [BullModule, ReceiptProducer],
})
export class QueueModule {}
