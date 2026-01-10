import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
export class LoginRequestDto {
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
}
