import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class AddUserDto {
  @ApiProperty({
    description: 'Email/username of the new user',
    example: 'newuser@example.com',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for the new user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiPropertyOptional({
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    example: '+919876543210',
  })
  @IsString()
  @IsOptional()
  phone_number?: string;
}
