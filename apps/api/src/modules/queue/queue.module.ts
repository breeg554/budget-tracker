import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bullmq';
import { ExpressAdapter } from '@bull-board/express';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullBoardModule } from '@bull-board/nestjs';
import { QueueAuthMiddleware } from '~/modules/queue/queue.auth-middleware';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { QueueNames } from '~/modules/queue/enums/queue-names.enum';

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
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QueueNames.test,
    }),

    BullBoardModule.forRoot({
      route: '/bull-board',
      adapter: ExpressAdapter,
      middleware: QueueAuthMiddleware,
    }),
    BullBoardModule.forFeature({
      name: QueueNames.test,
      adapter: BullMQAdapter,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
