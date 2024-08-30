import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '~/modules/auth/jwt.strategy';
import { LocalStrategy } from '~/modules/auth/local.strategy';
import { UserModule } from '~/modules/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '~/entities/session/session.entity';
import { EncryptionService } from '~/modules/encryption.service';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Session]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, EncryptionService],
  exports: [AuthService, JwtModule, EncryptionService],
})
export class AuthModule {}
