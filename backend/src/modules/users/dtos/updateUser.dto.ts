import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsEmail,
  IsOptional,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    type: String,
    required: false,
  })
  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  fullName: string;

  @ApiPropertyOptional({
    description: 'Age of the user (0-100)',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(0, { message: 'Age must be at least 0' })
  @Max(100, { message: 'Age must not exceed 100' })
  age: number;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Length(10, 10, { message: 'Phone number must be exactly 10 characters' })
  phone_number: string;

  @ApiPropertyOptional({
    description: 'Password of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  password: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}
