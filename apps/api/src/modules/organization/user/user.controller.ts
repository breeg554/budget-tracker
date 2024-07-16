import { Controller, Get } from '@nestjs/common';

import { GetUserDto } from '~/dtos/users/get-user.dto';
import { UserService } from '~/modules/organization/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): Promise<GetUserDto[]> {
    return this.userService.findAll();
  }
}
