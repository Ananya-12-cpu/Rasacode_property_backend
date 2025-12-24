import { IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
export class RegisterRequestDto {
  @IsString()
  username: string;

  password: string;
  confirm_password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  first_name?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(255)
  last_name?: string;

  @IsPhoneNumber('IN')
  phone_number?: string;
}
