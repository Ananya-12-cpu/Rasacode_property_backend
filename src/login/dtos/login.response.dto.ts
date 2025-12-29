import { Expose, Type } from 'class-transformer';

/* ---------- User DTO ---------- */
export class LoginUserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  first_name: string | null;

  @Expose()
  last_name: string | null;

  @Expose()
  phone_number: string | null;
}

/* ---------- Tokens DTO ---------- */
export class LoginTokensDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

/* ---------- Data Wrapper DTO ---------- */
export class LoginDataDto {
  @Expose()
  @Type(() => LoginUserDto)
  user: LoginUserDto;

  @Expose()
  @Type(() => LoginTokensDto)
  tokens: LoginTokensDto;
}
