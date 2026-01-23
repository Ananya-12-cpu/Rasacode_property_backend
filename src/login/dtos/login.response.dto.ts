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

  @Expose()
  role: string | null;
}

/* ---------- Tokens DTO ---------- */
export class LoginTokensDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

/* ---------- Plan DTO ---------- */
export class LoginPlanDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  display_name: string;

  @Expose()
  plan_type: string;

  @Expose()
  price: number;

  @Expose()
  billing_cycle: string;

  @Expose()
  features: string[];
}

/* ---------- Subscription DTO ---------- */
export class LoginSubscriptionDto {
  @Expose()
  id: number;

  @Expose()
  status: string;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  @Type(() => LoginPlanDto)
  plan: LoginPlanDto;
}

/* ---------- Data Wrapper DTO ---------- */
export class LoginDataDto {
  @Expose()
  @Type(() => LoginUserDto)
  user: LoginUserDto;

  @Expose()
  @Type(() => LoginSubscriptionDto)
  subscription: LoginSubscriptionDto | null;

  @Expose()
  @Type(() => LoginTokensDto)
  tokens: LoginTokensDto;
}
