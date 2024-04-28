import { Controller, Get } from '@nestjs/common';
import { UserService } from '~/modules/user/user.service';
import { GetUserDto } from '~/dtos/users/get-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): Promise<GetUserDto[]> {
    return this.userService.findAll();
  }
}
