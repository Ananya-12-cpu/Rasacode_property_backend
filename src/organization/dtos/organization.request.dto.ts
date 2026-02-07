import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsNotEmpty()
  @IsString()
  name: string;

  // @ApiPropertyOptional({ example: 'acme' })
  // @IsOptional()
  // @IsString()
  // subdomain?: string;

  // @ApiPropertyOptional({ example: 'acme.com' })
  // @IsOptional()
  // @IsString()
  // domain?: string;

  @ApiPropertyOptional({ example: 'Real Estate' })
  @IsOptional()
  @IsString()
  industry?: string;

  // @ApiPropertyOptional({ example: '50-100' })
  // @IsOptional()
  // @IsString()
  // size?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logo_url?: string;

  // @ApiPropertyOptional({ example: '{}' })
  // @IsOptional()
  // @IsString()
  // settings?: string;

  // @ApiPropertyOptional({ example: 'active' })
  // @IsOptional()
  // @IsString()
  // status?: string;
}

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  name?: string;

  // @ApiPropertyOptional({ example: 'acme' })
  // @IsOptional()
  // @IsString()
  // subdomain?: string;

  // @ApiPropertyOptional({ example: 'acme.com' })
  // @IsOptional()
  // @IsString()
  // domain?: string;

  @ApiPropertyOptional({ example: 'Real Estate' })
  @IsOptional()
  @IsString()
  industry?: string;

  // @ApiPropertyOptional({ example: '50-100' })
  // @IsOptional()
  // @IsString()
  // size?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  logo_url?: string;

  // @ApiPropertyOptional({ example: '{}' })
  // @IsOptional()
  // @IsString()
  // settings?: string;

  // @ApiPropertyOptional({ example: 'active' })
  // @IsOptional()
  // @IsString()
  // status?: string;
}

export class AddUserToOrganizationDto {
  @ApiProperty({
    description: 'User ID to add to the organization',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  user_id: number;
}

export class OrganizationFilterDto {
  @ApiPropertyOptional({
    description: 'Search by name, subdomain, domain, or industry',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
