import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '@modules/users/users.service';
import { JWT_REFRESH_TOKEN_SECRET } from '@environments';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: JWT_REFRESH_TOKEN_SECRET,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findById(payload.userId);
  }
}
