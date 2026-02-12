import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type RequestWithUser = { user?: Record<string, unknown> };

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user ?? {};

    if (!data) {
      return user;
    }

    return user[data];
  },
);
