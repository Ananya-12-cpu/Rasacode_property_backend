import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LeadService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getLeadProperties(userId: number) {
    const result = await this.dataSource.query(
      'EXEC sp_GetLeadProperties @UserId = @0',
      [userId],
    );

    return result;
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
