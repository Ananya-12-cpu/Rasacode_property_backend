/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Get, Param, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GenericResponseDto } from './dtos/generic-response.dto';
import { Property } from 'src/entities/property.entity';

@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  @ApiOperation({ summary: 'Get lead properties for a user' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiOkResponse({ description: 'Lead properties fetched successfully' })
  async findAll(
    @Query('userId') userId,
  ): Promise<GenericResponseDto<Property[]>> {
    const data = await this.leadService.getLeadProperties(userId);

    return {
      is_success: true,
      message: 'Leads fetched successfully',
      data,
    };
  }

  // async getLeads(@Query('userId') userId) {
  //   // const userId = req.user.id; // from JWT
  //   const data = await this.leadService.getLeadProperties(userId);

  //   return {
  //     is_success: true,
  //     message: 'Lead properties fetched successfully',
  //     data,
  //   };
  // }

  @Post('like/:propertyId')
  @ApiOperation({ summary: 'Like or unlike a property for a user' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({ description: 'Property liked/unliked successfully' })
  async likeProperty(
    @Query('userId') userId,
    @Param('propertyId') propertyId: number,
  ) {
    return this.leadService.likeProperty(userId, propertyId);
  }
}
