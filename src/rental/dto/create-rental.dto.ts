import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import {
  RentFrequency,
  SmokingPolicy,
} from '../../entities/property-rental.entity';

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

  // Rental listing fields
  @ApiProperty({
    enum: RentFrequency,
    example: RentFrequency.MONTHLY,
    description: 'Rent frequency',
  })
  @IsEnum(RentFrequency)
  rent_frequency!: RentFrequency;

  @ApiPropertyOptional({ example: 12, description: 'Lease duration in months' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lease_duration_months?: number;

  @ApiProperty({
    example: '2026-04-01',
    description: 'Date from which rental is available (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsNotEmpty()
  available_from!: string;

  @ApiProperty({
    enum: SmokingPolicy,
    example: SmokingPolicy.NOT_ALLOWED,
    description: 'Smoking policy',
  })
  @IsEnum(SmokingPolicy)
  smoking_policy!: SmokingPolicy;

  @ApiPropertyOptional({
    example: false,
    description: 'Is the unit furnished?',
  })
  @IsOptional()
  @IsBoolean()
  is_furnished?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Are pets allowed?' })
  @IsOptional()
  @IsBoolean()
  pets_allowed?: boolean;

  @ApiPropertyOptional({ example: 200.0, description: 'Application fee' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  application_fee?: number;

  @ApiPropertyOptional({ example: 500.0, description: 'Move-in fees' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  move_in_fees?: number;

  @ApiPropertyOptional({
    example: ['water', 'electricity', 'gas'],
    description:
      'Utilities included (water, electricity, gas, internet, cable, trash, sewer, heat, air_conditioning)',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? (value as string[])
      : typeof value === 'string'
        ? value.split(',').map((v) => v.trim())
        : [],
  )
  @IsArray()
  @IsString({ each: true })
  utilities_included?: string[];

  @ApiPropertyOptional({
    example: ['pool', 'gym'],
    description: 'Amenities & facilities (pool, gym, elevator, parking, ...)',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? (value as string[])
      : typeof value === 'string'
        ? value.split(',').map((v) => v.trim())
        : [],
  )
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Rental images (multipart/form-data)',
  })
  @IsOptional()
  images?: any;
}
