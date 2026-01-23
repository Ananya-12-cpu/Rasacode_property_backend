import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Plan } from '../entities/plan.entity';
import { Role } from '../entities/role.entity';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Role]), RbacModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
