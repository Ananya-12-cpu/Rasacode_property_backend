import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
