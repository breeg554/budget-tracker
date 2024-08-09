import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignInDto } from '~/dtos/auth/sign-in.dto';
import { CreateUserDto } from '~/dtos/users/create-user.dto';
import { GetUserDto } from '~/dtos/users/get-user.dto';
import { User } from '~/entities/user/user.entity';
import { UserService } from '~/modules/organization/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '~/entities/session/session.entity';
import { EncryptionService } from '~/modules/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private encryptionService: EncryptionService,
  ) {}

  async validateUser(email: string, password: string): Promise<GetUserDto> {
    const user: User = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Password or email does not match');
    }

    const isMatch: boolean = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Password or email does not match');
    }

    return user;
  }

  async signIn(payload: SignInDto) {
    const user = await this.userService.findOneByEmail(payload.email);

    if (!user) {
      throw new BadRequestException('Password or email does not match');
    }

    const accessToken = this.generateAccessToken({
      email: user.email,
      id: user.id,
    });
    const refreshToken = this.generateRefreshToken({
      email: user.email,
      id: user.id,
    });

    await this.saveSession(user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(user: CreateUserDto) {
    const existingUser = await this.userService.findOneByEmail(user.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = await this.userService.create({
      ...user,
      password: hashedPassword,
    });

    return this.signIn(newUser);
  }

  private async saveSession(user: User, refreshToken: string) {
    let session = await this.sessionRepository.findOne({
      where: { user: { id: user.id } },
    });

    const encryptedRefreshToken = this.encryptionService.encrypt(refreshToken);

    if (session) {
      session.refreshToken = encryptedRefreshToken;
    } else {
      session = this.sessionRepository.create({
        user,
        refreshToken: encryptedRefreshToken,
      });
    }

    await this.sessionRepository.save(session);
  }

  generateAccessToken(payload: { email: string; id: string }) {
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  generateRefreshToken(payload: { email: string; id: string }) {
    return this.jwtService.sign(payload, { expiresIn: '60d' });
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const userId = payload.id;

      const session = await this.sessionRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!session) {
        throw new UnauthorizedException();
      }

      const decryptedRefreshToken = this.encryptionService.decrypt(
        session.refreshToken,
      );

      if (decryptedRefreshToken !== refreshToken) {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new UnauthorizedException();
      }

      return {
        accessToken: this.generateAccessToken({
          email: user.email,
          id: user.id,
        }),
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
