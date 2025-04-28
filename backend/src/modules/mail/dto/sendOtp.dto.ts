import { IsString } from 'class-validator';

export class SendOtpDto {
  @IsString()
  email: string;

  @IsString()
  code: string;

  @IsString()
  name: string;
}
