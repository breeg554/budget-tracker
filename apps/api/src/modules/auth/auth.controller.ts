import {
  BadRequestException,
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
import { AuthUser, User } from '~/modules/decorators/user.decorator';
import { AuthWsService } from '~/modules/auth/auth-ws.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authWsService: AuthWsService,
  ) {}
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
    //eslint-disable-next-line
    @Res({ passthrough: true }) res: Response,
  ) {
    //eslint-disable-next-line
    const { accessToken, refreshToken } =
      await this.authService.signUp(signUpDto);

    throw new BadRequestException('Registration is disabled');

    // this.returnCookie(res, accessToken, refreshToken);
  }

  @Post('socket')
  async authSocket(@Body() body: { socketId: string }, @User() user: AuthUser) {
    return this.authWsService.createAuthToken(body.socketId, user);
  }

  private returnCookie(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 1 * 60 * 1000),
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    res.send({ status: 'ok' });
  }
}
