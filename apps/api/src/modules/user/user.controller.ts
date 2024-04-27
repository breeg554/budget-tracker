import { Controller, Get } from '@nestjs/common';
import { UserService } from '~/modules/user/user.service';
import { Public } from '~/modules/auth/public.decorator';

@Public()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello() {
    return this.userService.findAll();
  }
}
