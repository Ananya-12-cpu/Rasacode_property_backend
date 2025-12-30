import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class LoginRequestDto {
  @ApiPropertyOptional({ example: 'user' })
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: 'password123' })
  @IsString()
  password: string;
}
