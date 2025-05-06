import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'database/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phone_number',
    });
  }
  async validate(phone_number: string, password: string): Promise<User | null> {
    return this.authService.getAuthenticatedUser(phone_number, password);
  }
}
