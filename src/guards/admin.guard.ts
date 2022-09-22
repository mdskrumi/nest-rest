import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    console.log(req.currentUser);
    if (!req.currentUser) {
      return false;
    }
    return req.currentUser.admin;
  }
}
