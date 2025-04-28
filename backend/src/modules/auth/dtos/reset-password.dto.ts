import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  newPassword: string;
}
