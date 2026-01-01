/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Get, Param, Req, Query } from '@nestjs/common';
import { LeadService } from './lead.service';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  async getLeads(@Query('userId') userId) {
    // const userId = req.user.id; // from JWT
    const data = await this.leadService.getLeadProperties(userId);

    return {
      is_success: true,
      message: 'Lead properties fetched successfully',
      data,
    };
  }

  @Post('like/:propertyId')
  async likeProperty(
    @Query('userId') userId,
    @Param('propertyId') propertyId: number,
  ) {
    // const userId = query.userId;

    return this.leadService.likeProperty(userId, propertyId);
  }
}
