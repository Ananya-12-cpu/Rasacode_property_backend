import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionStructureDto } from './permission-structure.dto';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description:
      'The display title of the role (optional, auto-generated from role name if not provided)',
    example: 'Super Admin',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  role_title?: string;

  @ApiProperty({
    description: 'Array of permission structures for different resources',
    type: [PermissionStructureDto],
    example: [
      {
        campaign: {
          add: false,
          view: true,
          edit: true,
          delete: true,
        },
        properties: {
          add: true,
          view: true,
          edit: false,
          delete: false,
        },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionStructureDto)
  permission: PermissionStructureDto[];
}
