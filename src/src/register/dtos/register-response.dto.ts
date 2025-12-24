import { Expose } from 'class-transformer';

export class RegisterResponseDto {
  @Expose()
  username: string;

  @Expose()
  first_name: string | null;

  @Expose()
  last_name: string | null;

  @Expose()
  phone_number: string | null;
}
