/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { LeadService } from './lead.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GenericResponseDto } from './dtos/generic-response.dto';
import { Property } from 'src/entities/property.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get lead properties for a user' })
  // @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiOkResponse({ description: 'Lead properties fetched successfully' })
  async findAll(@Req() req): Promise<GenericResponseDto<Property[]>> {
    const data = await this.leadService.getLeadProperties(req?.user?.userId);

    return {
      is_success: true,
      message: 'Leads fetched successfully',
      data,
    };
  }

  @Post('like/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like or unlike a property for a user' })
  // @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiParam({ name: 'propertyId', type: Number })
  @ApiOkResponse({ description: 'Property liked/unliked successfully' })
  async likeProperty(@Req() req, @Param('propertyId') propertyId: number) {
    return this.leadService.likeProperty(req?.user?.userId, propertyId);
  }
}
