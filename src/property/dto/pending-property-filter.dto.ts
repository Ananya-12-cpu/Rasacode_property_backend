import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PendingPropertyStatus } from '../../entities/pending-property.entity';

export class PendingPropertyFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: PendingPropertyStatus,
  })
  @IsOptional()
  @IsEnum(PendingPropertyStatus)
  status?: PendingPropertyStatus;

  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
