import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { RbacGuard } from './guards/rbac.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User, Organization])],
  controllers: [RbacController],
  providers: [RbacService, RbacGuard, RolesGuard],
  exports: [RbacService, RbacGuard, RolesGuard],
})
export class RbacModule {}
