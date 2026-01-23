import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
} from 'class-validator';
import { PlanType } from '../../entities/plan.entity';

export class CreatePlanDto {
  @ApiProperty({
    description: 'Unique name of the plan',
    example: 'basic_plan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Display name of the plan',
    example: 'Basic Plan',
  })
  @IsString()
  @IsOptional()
  display_name?: string;

  @ApiPropertyOptional({
    description: 'Description of the plan',
    example: 'Perfect for getting started',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price of the plan',
    example: 9.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Billing cycle (monthly or yearly)',
    example: 'monthly',
    default: 'monthly',
  })
  @IsString()
  @IsOptional()
  billing_cycle?: string;

  @ApiProperty({
    description: 'Type of plan',
    enum: PlanType,
    example: PlanType.BASIC,
  })
  @IsEnum(PlanType)
  plan_type: PlanType;

  @ApiProperty({
    description: 'Role ID associated with this plan',
    example: 1,
  })
  @IsNumber()
  role_id: number;

  @ApiPropertyOptional({
    description: 'Whether the plan is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'List of features included in the plan',
    example: ['Access to basic features', 'Email support'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];
}
