import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourcePermissionDto } from './resource-permission.dto';

export class PermissionStructureDto {
  @ApiProperty({
    description: 'Permissions for campaign resource',
    type: ResourcePermissionDto,
    example: {
      add: false,
      view: true,
      edit: true,
      delete: true,
    },
  })
  @ValidateNested()
  @Type(() => ResourcePermissionDto)
  campaign: ResourcePermissionDto;

  @ApiProperty({
    description: 'Permissions for properties resource',
    type: ResourcePermissionDto,
    example: {
      add: true,
      view: true,
      edit: false,
      delete: false,
    },
  })
  @ValidateNested()
  @Type(() => ResourcePermissionDto)
  properties: ResourcePermissionDto;
}
