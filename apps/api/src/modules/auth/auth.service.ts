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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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

    return {
      accessToken: this.jwtService.sign({ email: user.email, id: user.id }),
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
}
