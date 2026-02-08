import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserSubscription } from '../entities/user-subscription.entity';
import { Organization } from '../entities/organization.entity';
import { UsersController } from './users.controller';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([Role, User, UserSubscription, Organization]),
    RbacModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
