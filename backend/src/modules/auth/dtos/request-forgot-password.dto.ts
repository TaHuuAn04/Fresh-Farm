import { IsString } from 'class-validator';

export class RequestForgotPasswordDto {
  @IsString()
  phoneNumber: string;
}
