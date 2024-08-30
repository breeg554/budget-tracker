import { Controller, Get } from '@nestjs/common';

import { GetUserDto } from '~/dtos/users/get-user.dto';
import { AuthUser, User } from '~/modules/decorators/user.decorator';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  me(@User() user: AuthUser): Promise<GetUserDto> {
    return this.userService.findOneByEmail(user.email);
  }
}
