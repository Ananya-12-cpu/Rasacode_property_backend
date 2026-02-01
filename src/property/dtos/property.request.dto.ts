import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyDto {
  // Listing info
  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  listing_date: string;

  @ApiProperty({ example: 450000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  listing_price: number;

  @ApiProperty({ example: 470000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  asking_price: number;

  // Address
  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  street_address: string;

  @ApiProperty({ example: 'Apt 402' })
  @IsString()
  unit_apt: string;

  @ApiProperty({ example: 'Mumbai' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Maharashtra' })
  @IsString()
  state: string;

  @ApiProperty({ example: '400001' })
  @IsString()
  zip_code: string;

  @ApiProperty({ example: 'Mumbai Suburban' })
  @IsString()
  county: string;

  // Property details
  @ApiProperty({ example: 'Residential' })
  @IsString()
  property_type: string;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiProperty({ example: 1200 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  square_feet: number;

  @ApiProperty({ example: '2000 sq ft' })
  @IsString()
  lot_size: string;

  @ApiProperty({ example: 2015 })
  @Type(() => Number)
  @IsNumber()
  year_built: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  garage_spaces: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  parking_spaces: number;

  // Property condition
  @ApiProperty({ example: '5 years' })
  @IsString()
  roof_age: string;

  @ApiProperty({ example: 'Good' })
  @IsString()
  roof_status: string;

  @ApiProperty({ example: 'Excellent' })
  @IsString()
  interior_condition: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  exterior_paint_required: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  new_floor_required: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  kitchen_renovation_required: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  bathroom_renovation_required: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  drywall_repair_required: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  interior_paint_required: boolean;

  // Financial
  @ApiPropertyOptional({ example: 600000 })
  @IsOptional()
  arv: number;

  @ApiProperty({ example: 80000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  repair_estimate: number;

  @ApiProperty({ example: 15000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  holding_costs: number;

  @ApiProperty({ example: 'Cash' })
  @IsString()
  transaction_type: string;

  @ApiProperty({ example: 10000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  assignment_fee: number;

  // Notes
  @ApiPropertyOptional({ example: 'Great investment opportunity' })
  @IsOptional()
  @IsString()
  property_description?: string;

  @ApiPropertyOptional({ example: 'Seller motivated' })
  @IsOptional()
  @IsString()
  seller_notes?: string;
}
