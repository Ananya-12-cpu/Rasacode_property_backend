import { Expose, Type } from 'class-transformer';

export class GenericResponseDto<T> {
  @Expose()
  is_success: boolean;

  @Expose()
  message: string;

  @Expose()
  @Type(() => Object) // 👈 REQUIRED for nested serialization
  data?: T;
}
