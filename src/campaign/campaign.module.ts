import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { Campaign } from './../entities/campaign.entity';
import { RbacModule } from 'src/rbac/rbac.module';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), RbacModule],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [TypeOrmModule],
})
export class CampaignModule {}
