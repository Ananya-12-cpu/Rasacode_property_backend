import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User]), RbacModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
