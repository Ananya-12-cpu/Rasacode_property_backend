import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
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

@ApiTags('Properties')
@Controller('properties')
export class CampaignController {
  constructor(
    private readonly CampaignService: CampaignService,
    // private readonly propertyRepository: Repository<Campaign>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @ApiOperation({ summary: 'Get all properties' })
  async findAll(): Promise<GenericResponseDto<Campaign[]>> {
    const properties = await this.CampaignService.findAll();

    return {
      is_success: true,
      message: 'Properties fetched successfully',
      data: properties,
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
