import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { JWT_REFRESH_TOKEN_SECRET } from '@environments';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.Refresh;

          if (!token) {
            throw new UnauthorizedException('Vui lòng đăng nhập lại');
          }

          return token;
        },
      ]),
      secretOrKey: JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;

    const user = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );

    if (!user) {
      throw new UnauthorizedException('Token không hợp lệ.');
    }

    return user;
  }
}
