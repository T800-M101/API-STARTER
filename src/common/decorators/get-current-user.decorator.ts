import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/modules/auth/interface/user-payload.interace';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as any;

    if (data && user) {
      return user[data];
    }
    return user;
  },
);

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    return user?.userId || null;
  },
);

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    return authHeader?.split(' ')[1]; 
  },
);
