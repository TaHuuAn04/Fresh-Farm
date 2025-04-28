import { AppError } from '@common/dtos/errorResponse.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw new AppError(
        HttpStatus.UNAUTHORIZED,
        'Vui lòng đăng nhập và thử lại',
        'UNAUTHORIZED',
      );
    }
    return user;
  }
}
