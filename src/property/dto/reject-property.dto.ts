import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RejectPropertyDto {
  @ApiPropertyOptional({
    description: 'Reason for rejecting the property',
    example: 'Incomplete property details',
  })
  @IsOptional()
  @IsString()
  rejection_reason?: string;
}
