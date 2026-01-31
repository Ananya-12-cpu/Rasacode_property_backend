import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import {
  calculateLeadScore,
  LeadScoreInput,
  LeadScoreResult,
} from './lead-scoring.util';

@Injectable()
export class LeadService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async getLeadProperties(userId: number) {
    const result = await this.dataSource.query(
      'EXEC sp_GetLeadProperties @UserId = @0',
      [userId],
    );

    return (result as Record<string, unknown>[]).map((row) => ({
      ...row,
      ...this.scoreProperty(row as LeadScoreInput),
    }));
  }

  async scorePropertyById(propertyId: number): Promise<LeadScoreResult> {
    const property = await this.propertyRepository.findOneByOrFail({
      id: propertyId,
    });
    return calculateLeadScore(property);
  }

  private scoreProperty(data: LeadScoreInput) {
    const { lead_score, lead_status, breakdown } = calculateLeadScore(data);
    return { lead_score, lead_status, lead_score_breakdown: breakdown };
  }

  async likeProperty(userId: number, propertyId: number) {
    const result = await this.dataSource.query(
      'EXEC sp_LikeUnlikeProperty @UserId = @0, @PropertyId = @1',
      [userId, propertyId],
    );
    console.log(result);

    return {
      message: `Property ${result?.length > 0 ? 'liked' : 'unliked'} successfully`,
    };
  }
}
