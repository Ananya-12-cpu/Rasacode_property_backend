import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('RBAC - Role & Permission Management')
@Controller('rbac')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post('roles')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Create a new role with permissions',
    description:
      'Creates a new role with specified permissions for campaign and properties resources. Only accessible by super_admin.',
  })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role creation payload',
    examples: {
      user_role: {
        summary: 'User Role Example',
        description: 'Limited permissions for regular users',
        value: {
          role: 'user',
          permission: [
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
        },
      },
      super_admin_role: {
        summary: 'Super Admin Role Example',
        description: 'Full permissions for administrators',
        value: {
          role: 'super_admin',
          permission: [
            {
              campaign: {
                add: true,
                view: true,
                edit: true,
                delete: true,
              },
              properties: {
                add: true,
                view: true,
                edit: true,
                delete: true,
              },
            },
          ],
        },
      },
      manager_role: {
        summary: 'Manager Role Example',
        description: 'Partial permissions for managers',
        value: {
          role: 'manager',
          permission: [
            {
              campaign: {
                add: true,
                view: true,
                edit: true,
                delete: false,
              },
              properties: {
                add: true,
                view: true,
                edit: true,
                delete: false,
              },
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    schema: {
      example: {
        Id: 1,
        Name: 'user',
        permissions: [
          {
            id: 1,
            permissions: {
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
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have super_admin role',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Role already exists',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rbacService.createRole(createRoleDto);
  }

  @Get('roles')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Get all roles',
    description:
      'Retrieves all roles with their associated permissions. Only accessible by super_admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all roles retrieved successfully',
    schema: {
      example: [
        {
          Id: 1,
          Name: 'super_admin',
          permissions: [
            {
              id: 1,
              permissions: {
                campaign: {
                  add: true,
                  view: true,
                  edit: true,
                  delete: true,
                },
                properties: {
                  add: true,
                  view: true,
                  edit: true,
                  delete: true,
                },
              },
            },
          ],
        },
        {
          Id: 2,
          Name: 'user',
          permissions: [
            {
              id: 2,
              permissions: {
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
            },
          ],
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have super_admin role',
  })
  findAll() {
    return this.rbacService.findAllRoles();
  }

  @Get('roles/:id')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Get role by ID',
    description:
      'Retrieves a specific role by its ID with associated permissions. Only accessible by super_admin.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the role to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    schema: {
      example: {
        Id: 1,
        Name: 'user',
        permissions: [
          {
            id: 1,
            permissions: {
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
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have super_admin role',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Role with specified ID does not exist',
  })
  findOne(@Param('id') id: string) {
    return this.rbacService.findRoleById(+id);
  }

  @Patch('roles/:id')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Update role permissions',
    description:
      "Updates an existing role's permissions or name. Only accessible by super_admin.",
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the role to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateRoleDto,
    description: 'Role update payload (all fields are optional)',
    examples: {
      update_permissions: {
        summary: 'Update Permissions Only',
        description: 'Update only the permission structure',
        value: {
          permission: [
            {
              campaign: {
                add: true,
                view: true,
                edit: true,
                delete: false,
              },
              properties: {
                add: true,
                view: true,
                edit: true,
                delete: false,
              },
            },
          ],
        },
      },
      update_name: {
        summary: 'Update Role Name Only',
        description: 'Update only the role name',
        value: {
          role: 'advanced_user',
        },
      },
      update_both: {
        summary: 'Update Both Name and Permissions',
        description: 'Update both role name and permissions',
        value: {
          role: 'manager',
          permission: [
            {
              campaign: {
                add: true,
                view: true,
                edit: true,
                delete: true,
              },
              properties: {
                add: true,
                view: true,
                edit: true,
                delete: false,
              },
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    schema: {
      example: {
        Id: 1,
        Name: 'manager',
        permissions: [
          {
            id: 1,
            permissions: {
              campaign: {
                add: true,
                view: true,
                edit: true,
                delete: true,
              },
              properties: {
                add: true,
                view: true,
                edit: true,
                delete: false,
              },
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have super_admin role',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Role with specified ID does not exist',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Role name already exists',
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rbacService.updateRole(+id, updateRoleDto);
  }

  @Delete('roles/:id')
  @UseGuards(RolesGuard)
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Delete a role',
    description:
      'Deletes a role and all associated permissions. Only accessible by super_admin.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The ID of the role to delete',
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have super_admin role',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Role with specified ID does not exist',
  })
  remove(@Param('id') id: string) {
    return this.rbacService.deleteRole(+id);
  }

  @Get('my-permissions')
  @ApiOperation({
    summary: 'Get current user permissions',
    description:
      'Retrieves the permissions for the currently authenticated user based on their assigned roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'User permissions retrieved successfully',
    schema: {
      example: [
        {
          role: 'user',
          permissions: [
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
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  getMyPermissions(@Request() req: any) {
    return this.rbacService.getUserPermissions(req.user.id);
  }
}
