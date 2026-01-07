import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  MaxLength,
  IsIn,
  Max,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCampaignDto {
  // Required basic fields
  @ApiProperty({
    example: 'Summer Property Campaign',
    description: 'Campaign name (3-100 characters)',
  })
  @IsString()
  @MinLength(3, { message: 'Campaign name must be at least 3 characters' })
  @MaxLength(100, { message: 'Campaign name must be less than 100 characters' })
  name: string;

  @ApiProperty({
    example: 'seller_finder',
    description: 'Type of campaign',
    enum: ['buyer_finder', 'seller_finder', 'distressed_property', 'wholesale'],
  })
  @IsString()
  campaign_type: string;

  @ApiProperty({
    example: ['email', 'sms'],
    description: 'Marketing channels',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  channel: string[];

  @ApiProperty({ example: '2025-02-01', description: 'Campaign start date' })
  @IsString()
  scheduled_start_date: string;

  @ApiProperty({ example: '2025-03-01', description: 'Campaign end date' })
  @IsString()
  scheduled_end_date: string;

  @ApiProperty({ example: '09:00', description: 'Campaign start time (HH:MM)' })
  @IsString()
  scheduled_start_time: string;

  @ApiProperty({ example: '17:00', description: 'Campaign end time (HH:MM)' })
  @IsString()
  scheduled_end_time: string;

  @ApiProperty({
    example: 'Exclusive Investment Opportunity',
    description: 'Email subject line (5-150 characters)',
  })
  @IsString()
  @MinLength(5, { message: 'Subject line must be at least 5 characters' })
  @MaxLength(150, { message: 'Subject line must be less than 150 characters' })
  subject_line: string;

  @ApiProperty({
    example: 'Dear investor, we have an exciting opportunity...',
    description: 'Email content',
  })
  @IsString()
  email_content: string;

  @ApiProperty({
    example: 'active',
    description: 'Campaign status',
    enum: ['active', 'inactive', 'draft'],
  })
  @IsString()
  @IsIn(['active', 'inactive', 'draft'], {
    message: 'Please select a valid status',
  })
  status: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Use AI for personalization',
  })
  @IsOptional()
  @IsBoolean()
  use_ai_personalization?: boolean;

  // Geographic scope fields (conditional - required for non-buyer/seller_finder campaigns)
  @ApiPropertyOptional({
    example: 'city',
    description: 'Geographic scope type',
    enum: ['city', 'state', 'county', 'zip_code'],
  })
  @IsOptional()
  @IsString()
  geographic_scope_type?: string;

  @ApiPropertyOptional({
    example: 'Residential',
    description: 'Property type (required for non-buyer campaigns)',
  })
  @IsOptional()
  @IsString()
  property_type?: string;

  // Price range (conditional - required for non-buyer/seller_finder campaigns)
  @ApiPropertyOptional({
    example: 100000,
    description: 'Minimum price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1000, { message: 'Minimum price must be at least $1,000' })
  @Max(50000000, { message: 'Minimum price cannot exceed $50,000,000' })
  min_price?: number;

  @ApiPropertyOptional({
    example: 500000,
    description: 'Maximum price',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(50000000, { message: 'Maximum price cannot exceed $50,000,000' })
  max_price?: number;

  // Distress indicators (conditional - for non-buyer campaigns)
  @ApiPropertyOptional({
    example: ['foreclosure', 'tax_lien'],
    description: 'Distress indicators',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  distress_indicators?: string[];

  // Buyer Finder - Demographic Details
  @ApiPropertyOptional({
    example: 'pre_qualified',
    description: 'Last qualification status',
  })
  @IsOptional()
  @IsString()
  last_qualification?: string;

  @ApiPropertyOptional({
    example: '25-35',
    description: 'Age range',
  })
  @IsOptional()
  @IsString()
  age_range?: string;

  @ApiPropertyOptional({
    example: 'asian',
    description: 'Ethnicity',
  })
  @IsOptional()
  @IsString()
  ethnicity?: string;

  @ApiPropertyOptional({
    example: '50000-75000',
    description: 'Salary range',
  })
  @IsOptional()
  @IsString()
  salary_range?: string;

  @ApiPropertyOptional({
    example: 'married',
    description: 'Marital status',
    enum: ['married', 'single', 'divorced'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['married', 'single', 'divorced', ''], {
    message: 'Please select a valid marital status',
  })
  marital_status?: string;

  @ApiPropertyOptional({
    example: 'employed',
    description: 'Employment status',
    enum: ['employed', 'self_employed', 'retired'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['employed', 'self_employed', 'retired', ''], {
    message: 'Please select a valid employment status',
  })
  employment_status?: string;

  @ApiPropertyOptional({
    example: 'own_home',
    description: 'Home ownership status',
    enum: ['own_home', 'rent_home'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['own_home', 'rent_home', ''], {
    message: 'Please select a valid home ownership status',
  })
  home_ownership_status?: string;

  // Buyer Finder - Geographic Details
  @ApiPropertyOptional({
    example: 'USA',
    description: 'Buyer country',
  })
  @IsOptional()
  @IsString()
  buyer_country?: string;

  @ApiPropertyOptional({
    example: 'California',
    description: 'Buyer state',
  })
  @IsOptional()
  @IsString()
  buyer_state?: string;

  @ApiPropertyOptional({
    example: 'Los Angeles County',
    description: 'Buyer counties',
  })
  @IsOptional()
  @IsString()
  buyer_counties?: string;

  @ApiPropertyOptional({
    example: 'Los Angeles',
    description: 'Buyer city',
  })
  @IsOptional()
  @IsString()
  buyer_city?: string;

  @ApiPropertyOptional({
    example: 'Downtown',
    description: 'Buyer districts',
  })
  @IsOptional()
  @IsString()
  buyer_districts?: string;

  @ApiPropertyOptional({
    example: 'Central Parish',
    description: 'Buyer parish',
  })
  @IsOptional()
  @IsString()
  buyer_parish?: string;

  // Seller Finder - Geographic Details
  @ApiPropertyOptional({
    example: 'USA',
    description: 'Seller country',
  })
  @IsOptional()
  @IsString()
  seller_country?: string;

  @ApiPropertyOptional({
    example: 'Texas',
    description: 'Seller state',
  })
  @IsOptional()
  @IsString()
  seller_state?: string;

  @ApiPropertyOptional({
    example: 'Harris County',
    description: 'Seller counties',
  })
  @IsOptional()
  @IsString()
  seller_counties?: string;

  @ApiPropertyOptional({
    example: 'Houston',
    description: 'Seller city',
  })
  @IsOptional()
  @IsString()
  seller_city?: string;

  @ApiPropertyOptional({
    example: 'Heights',
    description: 'Seller districts',
  })
  @IsOptional()
  @IsString()
  seller_districts?: string;

  @ApiPropertyOptional({
    example: 'East Parish',
    description: 'Seller parish',
  })
  @IsOptional()
  @IsString()
  seller_parish?: string;

  // Seller Finder - Additional Fields
  @ApiPropertyOptional({
    example: 'motivated seller, distressed property',
    description: 'Keywords for seller search (max 1000 characters)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Keywords must be less than 1000 characters' })
  seller_keywords?: string;
}
