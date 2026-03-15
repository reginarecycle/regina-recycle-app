import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CollectorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.role !== 'COLLECTOR') {
      throw new ForbiddenException('Access denied. Collectors only.');
    }

    return true;
  }
}
