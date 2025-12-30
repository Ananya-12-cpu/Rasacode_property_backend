import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyDto {
  // Listing info
  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  listing_date?: string;

  @ApiPropertyOptional({ example: 450000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  listing_price?: number;

  @ApiPropertyOptional({ example: 470000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  asking_price?: number;

  // Address
  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsOptional()
  @IsString()
  street_address?: string;

  @ApiPropertyOptional({ example: 'Apt 402' })
  @IsOptional()
  @IsString()
  unit_apt?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '400001' })
  @IsOptional()
  @IsString()
  zip_code?: string;

  @ApiPropertyOptional({ example: 'Mumbai Suburban' })
  @IsOptional()
  @IsString()
  county?: string;

  // Property details
  @ApiPropertyOptional({ example: 'Residential' })
  @IsOptional()
  @IsString()
  property_type?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: 1200 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  square_feet?: number;

  @ApiPropertyOptional({ example: '2000 sq ft' })
  @IsOptional()
  @IsString()
  lot_size?: string;

  @ApiPropertyOptional({ example: 2015 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year_built?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  garage_spaces?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  parking_spaces?: number;

  // Property condition
  @ApiPropertyOptional({ example: '5 years' })
  @IsOptional()
  @IsString()
  roof_age?: string;

  @ApiPropertyOptional({ example: 'Good' })
  @IsOptional()
  @IsString()
  roof_status?: string;

  @ApiPropertyOptional({ example: 'Excellent' })
  @IsOptional()
  @IsString()
  interior_condition?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  exterior_paint_required?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  new_floor_required?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  kitchen_renovation_required?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  bathroom_renovation_required?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  drywall_repair_required?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  interior_paint_required?: boolean;

  // Financial
  @ApiPropertyOptional({ example: 600000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  arv?: number;

  @ApiPropertyOptional({ example: 80000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  repair_estimate?: number;

  @ApiPropertyOptional({ example: 15000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  holding_costs?: number;

  @ApiPropertyOptional({ example: 'Cash' })
  @IsOptional()
  @IsString()
  transaction_type?: string;

  @ApiPropertyOptional({ example: 10000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  assignment_fee?: number;

  // Notes
  @ApiPropertyOptional({ example: 'Great investment opportunity' })
  @IsOptional()
  @IsString()
  property_description?: string;

  @ApiPropertyOptional({ example: 'Seller motivated' })
  @IsOptional()
  @IsString()
  seller_notes?: string;

  // Images
  @ApiPropertyOptional({
    example: ['https://img1.jpg', 'https://img2.jpg'],
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
