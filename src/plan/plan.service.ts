import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../entities/plan.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import { UserSubscription } from '../entities/user-subscription.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanFilterDto } from './dto/plan-filter.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepository: Repository<UserSubscription>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    // Check if plan with same name exists
    const existingPlan = await this.planRepository.findOne({
      where: { name: createPlanDto.name },
    });

    if (existingPlan) {
      throw new ConflictException('Plan with this name already exists');
    }

    // Verify role exists
    const role = await this.roleRepository.findOne({
      where: { Id: createPlanDto.role_id },
    });

    if (!role) {
      throw new NotFoundException(
        `Role with ID ${createPlanDto.role_id} not found`,
      );
    }

    // Verify organization exists
    const organization = await this.organizationRepository.findOne({
      where: { id: createPlanDto.organization_id },
    });
    if (!organization) {
      throw new NotFoundException(
        `Organization with ID ${createPlanDto.organization_id} not found`,
      );
    }

    // Auto-generate display_name if not provided
    const displayName =
      createPlanDto.display_name ||
      createPlanDto.name
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const plan = this.planRepository.create({
      ...createPlanDto,
      display_name: displayName,
      role,
      organization,
    });

    return this.planRepository.save(plan);
  }

  async findAll(filterDto: PlanFilterDto) {
    const { search, organization_id, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.planRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .leftJoinAndSelect('plan.organization', 'organization');

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(plan.name LIKE :search OR plan.display_name LIKE :search OR plan.description LIKE :search)',
        { search: searchTerm },
      );
    }

    if (organization_id) {
      queryBuilder.andWhere('plan.organization_id = :organization_id', {
        organization_id,
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('plan.price', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findActive(): Promise<Plan[]> {
    return this.planRepository.find({
      where: { is_active: true },
      relations: ['role', 'role.permissions', 'organization'],
      order: { price: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions', 'organization'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  async findByPlanType(planType: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { plan_type: planType as any, is_active: true },
      relations: ['role', 'role.permissions', 'organization'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with type ${planType} not found`);
    }

    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);

    // If role_id is being updated, verify the new role exists
    if (updatePlanDto.role_id) {
      const role = await this.roleRepository.findOne({
        where: { Id: updatePlanDto.role_id },
      });

      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updatePlanDto.role_id} not found`,
        );
      }

      plan.role = role;
    }

    // Check for name conflict if name is being updated
    if (updatePlanDto.name && updatePlanDto.name !== plan.name) {
      const existingPlan = await this.planRepository.findOne({
        where: { name: updatePlanDto.name },
      });

      if (existingPlan) {
        throw new ConflictException('Plan with this name already exists');
      }
    }

    Object.assign(plan, updatePlanDto);

    return this.planRepository.save(plan);
  }

  async remove(id: number): Promise<{ message: string }> {
    const plan = await this.findOne(id);

    // Check for existing subscriptions
    const subscriptionCount = await this.subscriptionRepository.count({
      where: { plan_id: id },
    });

    if (subscriptionCount > 0) {
      throw new ConflictException(
        `Cannot delete plan. ${subscriptionCount} subscription(s) are using this plan. Consider deactivating the plan instead.`,
      );
    }

    await this.planRepository.remove(plan);
    return { message: 'Plan deleted successfully' };
  }
}
