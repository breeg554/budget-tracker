import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { SignInDto } from '~/dtos/auth/sign-in.dto';
import { CreateUserDto } from '~/dtos/users/create-user.dto';
import { AuthService } from '~/modules/auth/auth.service';
import { Public } from '~/modules/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInDto);

    this.returnCookie(res, accessToken, refreshToken);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() signUpDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signUp(signUpDto);

    this.returnCookie(res, accessToken, refreshToken);
  }

  private returnCookie(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 60 * 1000),
      })
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    res.send({ status: 'ok' });
  }
}
