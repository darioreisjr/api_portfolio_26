import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthPayload } from '../interfaces/auth-payload.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IAuthPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: IAuthPayload }>();
    return request.user;
  },
);
