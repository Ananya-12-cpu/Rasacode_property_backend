import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { UserSubscription } from '../entities/user-subscription.entity';
import { User } from '../entities/user.entity';
import { Plan } from '../entities/plan.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSubscription, User, Plan, Role, Organization]),
    RbacModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
