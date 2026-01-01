import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../entities/property.entity';
import { UserPropertyLike } from '../entities/user-property-likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, UserPropertyLike])],
  providers: [LeadService],
  controllers: [LeadController],
})
export class LeadModule {}
