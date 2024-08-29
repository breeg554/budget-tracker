import { Controller, Get } from '@nestjs/common';
import { Public } from '~/modules/decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('health')
  checkHealth(): string {
    return 'ok';
  }
}
