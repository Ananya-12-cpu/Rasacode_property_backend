import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CampaignResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Summer Property Campaign' })
  name: string;

  @ApiProperty({ example: 'seller_finder' })
  campaign_type: string;

  @ApiProperty({ example: ['email', 'sms'], isArray: true })
  channel: string[];

  @ApiProperty({ example: '2025-02-01' })
  scheduled_start_date: string;

  @ApiProperty({ example: '2025-03-01' })
  scheduled_end_date: string;

  @ApiProperty({ example: '09:00' })
  scheduled_start_time: string;

  @ApiProperty({ example: '17:00' })
  scheduled_end_time: string;

  @ApiProperty({ example: 'Exclusive Investment Opportunity' })
  subject_line: string;

  @ApiProperty({ example: 'Dear investor, we have an exciting opportunity...' })
  email_content: string;

  @ApiProperty({ example: 'active' })
  status: string;

  @ApiPropertyOptional({ example: true })
  use_ai_personalization?: boolean;

  @ApiPropertyOptional({ example: 'city' })
  geographic_scope_type?: string;

  @ApiPropertyOptional({ example: 'Residential' })
  property_type?: string;

  @ApiPropertyOptional({ example: 100000 })
  min_price?: number;

  @ApiPropertyOptional({ example: 500000 })
  max_price?: number;

  @ApiPropertyOptional({ example: ['foreclosure', 'tax_lien'], isArray: true })
  distress_indicators?: string[];

  // Buyer Finder - Demographic Details
  @ApiPropertyOptional({ example: 'pre_qualified' })
  last_qualification?: string;

  @ApiPropertyOptional({ example: '25-35' })
  age_range?: string;

  @ApiPropertyOptional({ example: 'asian' })
  ethnicity?: string;

  @ApiPropertyOptional({ example: '50000-75000' })
  salary_range?: string;

  @ApiPropertyOptional({ example: 'married' })
  marital_status?: string;

  @ApiPropertyOptional({ example: 'employed' })
  employment_status?: string;

  @ApiPropertyOptional({ example: 'own_home' })
  home_ownership_status?: string;

  // Buyer Finder - Geographic Details
  @ApiPropertyOptional({ example: 'USA' })
  buyer_country?: string;

  @ApiPropertyOptional({ example: 'California' })
  buyer_state?: string;

  @ApiPropertyOptional({ example: 'Los Angeles County' })
  buyer_counties?: string;

  @ApiPropertyOptional({ example: 'Los Angeles' })
  buyer_city?: string;

  @ApiPropertyOptional({ example: 'Downtown' })
  buyer_districts?: string;

  @ApiPropertyOptional({ example: 'Central Parish' })
  buyer_parish?: string;

  // Seller Finder - Geographic Details
  @ApiPropertyOptional({ example: 'USA' })
  seller_country?: string;

  @ApiPropertyOptional({ example: 'Texas' })
  seller_state?: string;

  @ApiPropertyOptional({ example: 'Harris County' })
  seller_counties?: string;

  @ApiPropertyOptional({ example: 'Houston' })
  seller_city?: string;

  @ApiPropertyOptional({ example: 'Heights' })
  seller_districts?: string;

  @ApiPropertyOptional({ example: 'East Parish' })
  seller_parish?: string;

  @ApiPropertyOptional({ example: 'motivated seller, distressed property' })
  seller_keywords?: string;

  @ApiProperty({ example: '2025-01-10T12:30:00Z' })
  created_at: string;

  @ApiProperty({ example: '2025-01-10T12:30:00Z' })
  updated_at: string;
}
