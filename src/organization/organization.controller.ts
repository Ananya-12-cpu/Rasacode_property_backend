import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationFilterDto,
  AddUserToOrganizationDto,
} from './dtos/organization.request.dto';

@ApiTags('Organizations')
@ApiBearerAuth()
@Controller('organizations')
@UseGuards(JwtAuthGuard, RbacGuard)
@Roles('super_admin')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async create(@Body() dto: CreateOrganizationDto) {
    const data = await this.organizationService.create(dto);
    return {
      is_success: true,
      message: 'Organization created successfully',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations with search and pagination' })
  async findAll(@Query() filterDto: OrganizationFilterDto) {
    const result = await this.organizationService.findAll(filterDto);
    return {
      is_success: true,
      message: 'Organizations fetched successfully',
      data: result.data,
      pagination: result.pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.organizationService.findOne(id);
    return {
      is_success: true,
      message: 'Organization fetched successfully',
      data,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update organization by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrganizationDto,
  ) {
    const data = await this.organizationService.update(id, dto);
    return {
      is_success: true,
      message: 'Organization updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization by ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.organizationService.remove(id);
    return {
      is_success: true,
      message: 'Organization deleted successfully',
    };
  }

  @Post(':id/users')
  @ApiOperation({ summary: 'Add a user to an organization' })
  async addUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddUserToOrganizationDto,
  ) {
    const data = await this.organizationService.addUser(id, dto.user_id);
    return {
      is_success: true,
      message: 'User added to organization successfully',
      data,
    };
  }

  @Delete(':id/users/:userId')
  @ApiOperation({ summary: 'Remove a user from an organization' })
  async removeUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    await this.organizationService.removeUser(id, userId);
    return {
      is_success: true,
      message: 'User removed from organization successfully',
    };
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get all users in an organization' })
  async getUsers(@Param('id', ParseIntPipe) id: number) {
    const data = await this.organizationService.getUsers(id);
    return {
      is_success: true,
      message: 'Organization users fetched successfully',
      data,
    };
  }

  @Delete(':id/plans/:planId')
  @ApiOperation({ summary: 'Remove a plan from an organization' })
  async removePlan(
    @Param('id', ParseIntPipe) id: number,
    @Param('planId', ParseIntPipe) planId: number,
  ) {
    await this.organizationService.removePlan(id, planId);
    return {
      is_success: true,
      message: 'Plan removed from organization successfully',
    };
  }

  @Get(':id/plans')
  @Roles()
  @ApiOperation({ summary: 'Get all plans in an organization' })
  async getPlans(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const userOrgId = req.user?.organization_id;
    if (!userOrgId || userOrgId !== id) {
      throw new ForbiddenException('You are not attached to this organization');
    }
    const data = await this.organizationService.getPlans(id);
    return {
      is_success: true,
      message: 'Organization plans fetched successfully',
      data,
    };
  }

  @Get(':id/roles')
  @ApiOperation({ summary: 'Get all roles in an organization' })
  async getRoles(@Param('id', ParseIntPipe) id: number) {
    const data = await this.organizationService.getRoles(id);
    return {
      is_success: true,
      message: 'Organization roles fetched successfully',
      data,
    };
  }
}
