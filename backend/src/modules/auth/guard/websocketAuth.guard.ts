import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_ACCESS_TOKEN_SECRET } from '@environments';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) throw new WsException('Token not found');

    try {
      const payload = this.jwtService.verify(token, {
        secret: JWT_ACCESS_TOKEN_SECRET,
      });
      client.data.user = payload;
      return true;
    } catch {
      throw new WsException('Invalid token');
    }
  }
}
