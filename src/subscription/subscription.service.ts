import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserSubscription,
  SubscriptionStatus,
  PaymentStatus,
} from '../entities/user-subscription.entity';
import { User } from '../entities/user.entity';
import { Plan } from '../entities/plan.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionStatusDto,
  ConfirmPaymentDto,
} from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  // Create a new subscription (pending payment)
  async create(dto: CreateSubscriptionDto): Promise<UserSubscription> {
    const user = await this.userRepository.findOne({
      where: { id: dto.user_id },
      relations: ['organization'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);
    }

    const plan = await this.planRepository.findOne({
      where: { id: dto.plan_id },
      relations: ['role'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${dto.plan_id} not found`);
    }

    // Auto-assign user to the plan's organization
    if (plan.organization_id) {
      const userOrgId = user.organization?.id;
      if (!userOrgId || userOrgId !== plan.organization_id) {
        const organization = await this.organizationRepository.findOne({
          where: { id: plan.organization_id },
        });
        if (organization) {
          user.organization = organization;
          await this.userRepository.save(user);
        }
      }
    }

    // Check if user already has an active subscription
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user_id: dto.user_id,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (existingSubscription) {
      throw new BadRequestException(
        'User already has an active subscription. Please cancel it first or upgrade.',
      );
    }

    // const subscription = this.subscriptionRepository.create({
    //   user_id: dto.user_id,
    //   plan_id: dto.plan_id,
    //   status: SubscriptionStatus.PENDING,
    //   payment_status: PaymentStatus.PENDING,
    //   payment_method: dto.payment_method,
    //   transaction_id: dto.transaction_id,
    //   amount_paid: dto.amount_paid || plan.price,
    //   auto_renew: dto.auto_renew || false,
    // });
    const subscription = this.subscriptionRepository.create({
      user_id: dto.user_id,
      plan_id: dto.plan_id,
      payment_method: 'easebuzz',
      auto_renew: true,
    });

    return this.subscriptionRepository.save(subscription);
  }

  // Confirm payment and activate subscription
  async confirmPayment(
    subscriptionId: number,
    dto: ConfirmPaymentDto,
  ): Promise<UserSubscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['user', 'plan', 'plan.role'],
    });

    if (!subscription) {
      throw new NotFoundException(
        `Subscription with ID ${subscriptionId} not found`,
      );
    }

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      throw new BadRequestException(
        `Subscription ID ${subscriptionId} for user ID ${subscription.user_id} is already active`,
      );
    }

    // Calculate subscription period based on billing cycle
    const startDate = new Date();
    const endDate = new Date();

    if (subscription.plan.billing_cycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Update subscription
    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.payment_status = PaymentStatus.PAID;
    subscription.transaction_id = dto.transaction_id;
    subscription.payment_method = dto.payment_method;
    subscription.amount_paid = dto.amount_paid;
    subscription.start_date = startDate;
    subscription.end_date = endDate;

    //     {
    //   "transaction_id": "EZB202401191234567",
    //   "payment_method": "easebuzz",
    //   "amount_paid": 9.99
    // }

    await this.subscriptionRepository.save(subscription);

    // Assign the plan's role to the user
    await this.assignRoleToUser(
      subscription.user_id,
      subscription.plan.role.Id,
    );

    return subscription;
  }

  // Assign role to user based on plan - replaces all existing roles
  private async assignRoleToUser(
    userId: number,
    roleId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) return;

    const role = await this.roleRepository.findOne({
      where: { Id: roleId },
    });

    if (!role) return;

    // Replace all roles with the new subscription role
    user.roles = [role];

    await this.userRepository.save(user);
  }

  // Get user's active subscription
  async getActiveSubscription(
    userId: number,
  ): Promise<UserSubscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        user_id: userId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan', 'plan.role', 'plan.role.permissions'],
    });
  }

  // Get user's subscription history
  async getUserSubscriptions(userId: number): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      where: { user_id: userId },
      relations: ['plan'],
      order: { created_at: 'DESC' },
    });
  }

  // Get all subscriptions (admin)
  async findAll(): Promise<UserSubscription[]> {
    return this.subscriptionRepository.find({
      relations: ['user', 'plan'],
      order: { created_at: 'DESC' },
    });
  }

  // Get subscription by ID
  async findOne(id: number): Promise<UserSubscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'plan', 'plan.role', 'plan.role.permissions'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  // Cancel subscription
  async cancelSubscription(
    id: number,
    reason?: string,
  ): Promise<UserSubscription> {
    const subscription = await this.findOne(id);

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is already cancelled');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelled_at = new Date();
    subscription.cancellation_reason = reason || '';
    subscription.auto_renew = false;

    await this.subscriptionRepository.save(subscription);

    // Remove subscription role from user
    await this.removeSubscriptionRoleFromUser(subscription.user_id);

    return subscription;
  }

  // Remove subscription role from user
  private async removeSubscriptionRoleFromUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) return;

    const subscriptionRoles = ['basic_user', 'pro_user', 'professional_user'];
    user.roles = user.roles.filter((r) => !subscriptionRoles.includes(r.Name));

    await this.userRepository.save(user);
  }

  // Update subscription status (admin)
  async updateStatus(
    id: number,
    dto: UpdateSubscriptionStatusDto,
  ): Promise<UserSubscription> {
    const subscription = await this.findOne(id);

    subscription.status = dto.status;

    if (dto.payment_status) {
      subscription.payment_status = dto.payment_status;
    }

    if (dto.status === SubscriptionStatus.CANCELLED) {
      subscription.cancelled_at = new Date();
      subscription.cancellation_reason = dto.cancellation_reason || '';
      await this.removeSubscriptionRoleFromUser(subscription.user_id);
    }

    if (dto.status === SubscriptionStatus.ACTIVE && !subscription.start_date) {
      subscription.start_date = new Date();
      const endDate = new Date();
      if (subscription.plan.billing_cycle === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }
      subscription.end_date = endDate;
      await this.assignRoleToUser(
        subscription.user_id,
        subscription.plan.role.Id,
      );
    }

    return this.subscriptionRepository.save(subscription);
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId: number): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId);
    return !!subscription;
  }

  // Check if subscription is expired and update status
  async checkAndUpdateExpiredSubscriptions(): Promise<void> {
    const now = new Date();

    const expiredSubscriptions = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .andWhere('subscription.end_date < :now', { now })
      .getMany();

    for (const subscription of expiredSubscriptions) {
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepository.save(subscription);
      await this.removeSubscriptionRoleFromUser(subscription.user_id);
    }
  }
}
