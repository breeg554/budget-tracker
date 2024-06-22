import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    //@ts-ignore
    if (req.cookies && req.cookies.access_token) {
      //@ts-ignore
      return req.cookies.access_token;
    }
    return null;
  }

  async validate(payload: any) {
    //@todo implement refresh token
    return { id: payload.id, email: payload.email };
  }
}
