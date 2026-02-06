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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanFilterDto } from './dto/plan-filter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // Create plan (Super Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new subscription plan (Super Admin only)',
  })
  async create(@Body() createPlanDto: CreatePlanDto) {
    const plan = await this.planService.create(createPlanDto);
    return {
      is_success: true,
      message: 'Plan created successfully',
      data: plan,
    };
  }

  // Get all plans (Super Admin only)
  @Get()
  @ApiOperation({ summary: 'Get all subscription plans with pagination' })
  async findAll(@Query() filterDto: PlanFilterDto) {
    const result = await this.planService.findAll(filterDto);
    return {
      is_success: true,
      message: 'Plans fetched successfully',
      data: result.data,
      pagination: result.pagination,
    };
  }

  // Get active plans (Public - for users to see available plans)
  @Get('active')
  @ApiOperation({ summary: 'Get all active subscription plans (Public)' })
  async findActive() {
    const plans = await this.planService.findActive();
    return {
      is_success: true,
      message: 'Active plans fetched successfully',
      data: plans,
    };
  }

  // Get plan by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get subscription plan by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id') id: number) {
    const plan = await this.planService.findOne(+id);
    return {
      is_success: true,
      message: 'Plan fetched successfully',
      data: plan,
    };
  }

  // Update plan (Super Admin only)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription plan (Super Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  async update(@Param('id') id: number, @Body() updatePlanDto: UpdatePlanDto) {
    const plan = await this.planService.update(+id, updatePlanDto);
    return {
      is_success: true,
      message: 'Plan updated successfully',
      data: plan,
    };
  }

  // Delete plan (Super Admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete subscription plan (Super Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id') id: number) {
    const result = await this.planService.remove(+id);
    return {
      is_success: true,
      message: result.message,
    };
  }
}
