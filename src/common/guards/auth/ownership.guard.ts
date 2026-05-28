import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userIdFromParams = request.params.id;

    if (user.role === 'ADMIN') return true;

    if (user.sub !== userIdFromParams) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }

    return true;
  }
}