import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dtos/campaign.request.dto';
import { GenericResponseDto } from './dtos/generic-response.dto';
import { Campaign } from 'src/entities/campaign.entity';
import { UpdateCampaignDto } from './dtos/campaign.update.dto';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from 'src/rbac/guards/rbac.guard';
import { RequirePermission } from 'src/rbac/decorators/require-permission.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

@ApiTags('Campaign')
@Controller('Campaign')
export class CampaignController {
  constructor(
    private readonly CampaignService: CampaignService,
    // private readonly propertyRepository: Repository<Campaign>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'campaign', action: 'add' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully' })
  async create(
    @Body() dto: CreateCampaignDto,
  ): Promise<GenericResponseDto<Campaign>> {
    const campaign = await this.CampaignService.create(dto);

    return {
      is_success: true,
      message: 'Campaign created successfully',
      data: campaign,
    };
  }

  // GET ALL
  @Get()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'campaign', action: 'view' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Campaign with pagination' })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    const result = await this.CampaignService.findAll(paginationQuery);

    return {
      is_success: true,
      message: 'Campaign fetched successfully',
      data: result.data,
      pagination: result.meta,
    };
  }

  // GET BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponseDto<Campaign>> {
    const campaign = await this.CampaignService.findOne(+id);

    return {
      is_success: true,
      message: 'Campaign fetched successfully',
      data: campaign,
    };
  }

  //UPDATE
  @Put(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'campaign', action: 'edit' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update campaign' })
  @ApiParam({ name: 'id', type: Number })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCampaignDto,
  ): Promise<GenericResponseDto<Campaign>> {
    const campaign = await this.CampaignService.update(+id, dto);

    return {
      is_success: true,
      message: 'Campaign updated successfully',
      data: campaign,
    };
  }

  // DELETE
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'campaign', action: 'delete' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete campaign' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id') id: number): Promise<GenericResponseDto<null>> {
    await this.CampaignService.remove(+id);

    return {
      is_success: true,
      message: 'Campaign deleted successfully',
      data: null,
    };
  }
}
