import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Plan } from '../entities/plan.entity';
import { Permission } from '../entities/permission.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Role, Plan, Permission]), RbacModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
