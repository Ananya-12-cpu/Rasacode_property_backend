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
  async findOne(@Param('id') id: string) {
    const data = await this.organizationService.findOne(id);
    return {
      is_success: true,
      message: 'Organization fetched successfully',
      data,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update organization by ID' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    const data = await this.organizationService.update(id, dto);
    return {
      is_success: true,
      message: 'Organization updated successfully',
      data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization by ID' })
  async remove(@Param('id') id: string) {
    await this.organizationService.remove(id);
    return {
      is_success: true,
      message: 'Organization deleted successfully',
    };
  }
}
