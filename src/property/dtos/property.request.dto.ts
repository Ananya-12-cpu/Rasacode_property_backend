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

export class CreatePropertyDto {
  // Listing info
  @IsOptional()
  @IsDateString()
  listing_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  listing_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  asking_price?: number;

  // Address
  @IsOptional()
  @IsString()
  street_address?: string;

  @IsOptional()
  @IsString()
  unit_apt?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zip_code?: string;

  @IsOptional()
  @IsString()
  county?: string;

  // Property details
  @IsOptional()
  @IsString()
  property_type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  square_feet?: number;

  @IsOptional()
  @IsString()
  lot_size?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year_built?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  garage_spaces?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  parking_spaces?: number;

  // Property condition
  @IsOptional()
  @IsString()
  roof_age?: string;

  @IsOptional()
  @IsString()
  roof_status?: string;

  @IsOptional()
  @IsString()
  interior_condition?: string;

  @IsOptional()
  @IsBoolean()
  exterior_paint_required?: boolean;

  @IsOptional()
  @IsBoolean()
  new_floor_required?: boolean;

  @IsOptional()
  @IsBoolean()
  kitchen_renovation_required?: boolean;

  @IsOptional()
  @IsBoolean()
  bathroom_renovation_required?: boolean;

  @IsOptional()
  @IsBoolean()
  drywall_repair_required?: boolean;

  @IsOptional()
  @IsBoolean()
  interior_paint_required?: boolean;

  // Financial
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  arv?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  repair_estimate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  holding_costs?: number;

  @IsOptional()
  @IsString()
  transaction_type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  assignment_fee?: number;

  // Notes
  @IsOptional()
  @IsString()
  property_description?: string;

  @IsOptional()
  @IsString()
  seller_notes?: string;

  // Images
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
