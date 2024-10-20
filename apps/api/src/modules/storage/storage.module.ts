import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Service } from '~/modules/storage/s3.service';
import { StorageClient } from '~/modules/storage/interfaces/storage-client.interface';
import { LocalStorageService } from '~/modules/storage/local-storage.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
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
  providers: [
    {
      provide: StorageClient,
      useClass:
        process.env.NODE_ENV === 'production' ? S3Service : LocalStorageService,
    },
  ],
  exports: [StorageClient],
})
export class StorageModule {}
