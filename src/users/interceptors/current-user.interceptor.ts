import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { userId } = req.session;
    console.log(userId);
    if (userId) {
      const user = await this.userService.findOne(+userId);
      console.log(user);
      req.currentUser = user;
    }
    return handler.handle();
  }
}
