import { AuthUser } from '~/modules/decorators/user.decorator';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthWsService {
  constructor(private jwtService: JwtService) {}

  async createAuthToken(socketId: string, user: AuthUser) {
    return {
      token: this.jwtService.sign(
        { userId: user.id, socketId },
        { expiresIn: '1d' },
      ),
    };
  }
}
