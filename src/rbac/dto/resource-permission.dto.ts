import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResourcePermissionDto {
  @ApiProperty({
    description: 'Permission to add/create new resources',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  add: boolean;

  @ApiProperty({
    description: 'Permission to view/read resources',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  view: boolean;

  @ApiProperty({
    description: 'Permission to edit/update resources',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  edit: boolean;

  @ApiProperty({
    description: 'Permission to delete resources',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  delete: boolean;
}
