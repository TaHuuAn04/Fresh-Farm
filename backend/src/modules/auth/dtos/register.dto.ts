import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsEmail,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  age: number;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
