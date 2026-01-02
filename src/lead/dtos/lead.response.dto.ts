import { ApiProperty } from '@nestjs/swagger';

export class LeadResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-01-01' })
  listing_date?: string;

  @ApiProperty({ example: 450000 })
  listing_price?: number;

  @ApiProperty({ example: '123 Main Street' })
  street_address?: string;

  @ApiProperty({ example: 'Mumbai' })
  city?: string;

  @ApiProperty({ example: 3 })
  bedrooms?: number;

  @ApiProperty({ example: 2 })
  bathrooms?: number;

  @ApiProperty({ example: 1200 })
  square_feet?: number;

  @ApiProperty({ example: false })
  kitchen_renovation_required?: boolean;

  @ApiProperty({
    example: ['https://img1.jpg', 'https://img2.jpg'],
    isArray: true,
  })
  images?: string[];

  @ApiProperty({ example: '2025-01-10T12:30:00Z' })
  created_at: string;

  @ApiProperty({ example: '2025-01-10T12:30:00Z' })
  updated_at: string;
}
