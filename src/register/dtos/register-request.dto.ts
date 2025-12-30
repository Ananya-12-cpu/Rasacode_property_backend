import { IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiPropertyOptional({ example: 'user' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: 'password123' })
  @IsString()
  password: string;
  @ApiPropertyOptional({ example: 'password123' })
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
  phone_number?: string;
}
