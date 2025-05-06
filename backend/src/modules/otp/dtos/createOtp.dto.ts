import { VerifyOtpDto } from '@modules/auth/dtos/verify-otp.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
