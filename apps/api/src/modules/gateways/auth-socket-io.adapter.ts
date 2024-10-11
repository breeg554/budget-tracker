import { IoAdapter } from '@nestjs/platform-socket.io';
import { JwtService } from '@nestjs/jwt';
import { INestApplicationContext } from '@nestjs/common';

export class AuthenticatedSocketIoAdapter extends IoAdapter {
  private readonly jwtService: JwtService;
  constructor(private app: INestApplicationContext) {
    super(app);
    this.jwtService = this.app.get(JwtService);
  }

  createIOServer(port: number, options?: any): any {
    options.allowRequest = async (request, allowFunction) => {
      try {
        const token = new URL(
          request.url,
          process.env.API_URL,
        ).searchParams.get('token');
        const verified = token && (await this.jwtService.verify(token));

        if (verified) {
          return allowFunction(null, true);
        }

        return allowFunction('Unauthorized', false);
      } catch (e) {
        console.error('Error in gateway allowRequest: ', e);

        return allowFunction('Unauthorized', false);
      }
    };

    return super.createIOServer(port, options);
  }
}
