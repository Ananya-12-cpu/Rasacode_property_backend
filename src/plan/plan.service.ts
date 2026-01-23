import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../entities/plan.entity';
import { Role } from '../entities/role.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
    });

    return this.planRepository.save(plan);
  }

  async findAll(): Promise<Plan[]> {
    return this.planRepository.find({
      relations: ['role', 'role.permissions'],
      order: { price: 'ASC' },
    });
  }

  async findActive(): Promise<Plan[]> {
    return this.planRepository.find({
      where: { is_active: true },
      relations: ['role', 'role.permissions'],
      order: { price: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['role', 'role.permissions'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  async findByPlanType(planType: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { plan_type: planType as any, is_active: true },
      relations: ['role', 'role.permissions'],
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
    await this.planRepository.remove(plan);
    return { message: 'Plan deleted successfully' };
  }
}
