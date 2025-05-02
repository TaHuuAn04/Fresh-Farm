import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext): unknown => {
    const req = ctx
      .switchToHttp()
      .getRequest<{ user: Record<string, unknown> }>();

    if (key) {
      return req.user[key];
    }

    return req.user;
  },
);
