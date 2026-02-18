import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateRentalDto {
  @ApiProperty({ example: 1500.0, description: 'Monthly rent amount' })
  @IsNumber()
  @Min(0)
  monthly_rent: number;

  @ApiPropertyOptional({
    example: 3000.0,
    description: 'Security deposit amount',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  security_deposit?: number;

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

  @ApiProperty({
    example: '2026-03-01',
    description: 'Rental start date (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiPropertyOptional({
    example: '2027-03-01',
    description: 'Rental end date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    example: 'Includes utilities',
    description: 'Additional notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
