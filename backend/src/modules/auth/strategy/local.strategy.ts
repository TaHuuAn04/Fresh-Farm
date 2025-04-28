import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'database/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phoneNumber',
    });
  }
  async validate(phoneNumber: string, password: string): Promise<User | null> {
    return this.authService.getAuthenticatedUser(phoneNumber, password);
  }
}
