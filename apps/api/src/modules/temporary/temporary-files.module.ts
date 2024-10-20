import { Module } from '@nestjs/common';
import { TemporaryReceiptsController } from '~/modules/temporary/temporary-receipts.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemporaryReceiptsService } from '~/modules/temporary/temporary-receipts.service';
import { LocalStorageService } from '~/modules/storage/local-storage.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('LOCAL_STORAGE_JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TemporaryReceiptsController],
  providers: [TemporaryReceiptsService, LocalStorageService],
  exports: [],
})
export class TemporaryFilesModule {}
