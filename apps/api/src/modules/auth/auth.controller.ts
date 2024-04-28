import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '~/modules/auth/auth.service';
import { Public } from '~/modules/auth/public.decorator';
import { SignInDto } from '~/dtos/auth/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CreateUserDto } from '~/dtos/users/create-user.dto';

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
    const { accessToken } = await this.authService.signIn(signInDto);

    this.returnCookie(res, accessToken);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() signUpDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.signUp(signUpDto);

    this.returnCookie(res, accessToken);
  }

  private returnCookie(res: Response, token: string) {
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 24 * 24 * 60 * 1000),
      })
      .send({ status: 'ok' });
  }
}
