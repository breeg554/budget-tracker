import { Controller, Get } from '@nestjs/common';
import { UserService } from '~/modules/user/user.service';
import { Public } from '~/modules/auth/public.decorator';
import { GetUserDto } from '~/dtos/users/get-user.dto';

@Public()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): Promise<GetUserDto[]> {
    return this.userService.findAll();
  }
}
