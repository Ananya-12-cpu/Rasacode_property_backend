import {
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Email address (used as username)',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: 'password123' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 'password123' })
  @IsString()
  confirm_password: string;

  @ApiPropertyOptional({ example: 'firstname' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  first_name?: string;

  @ApiPropertyOptional({ example: 'lastname' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  last_name?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsPhoneNumber('IN')
  @IsOptional()
  phone_number?: string;
}
