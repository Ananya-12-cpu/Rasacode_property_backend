// users/users.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import {
  UserSubscription,
  SubscriptionStatus,
} from '../entities/user-subscription.entity';
import { UserFilterDto } from './dto/user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(
    username: string,
    passwordHash: string,
    first_name?: string,
    last_name?: string,
    phone_number?: string,
    roleName?: string,
  ) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Get role - default to 'free_role' if not specified
    const roleToAssign = roleName || 'free_role';
    const role = await this.roleRepository.findOne({
      where: { Name: roleToAssign },
    });

    if (!role) {
      throw new NotFoundException(
        `Role '${roleToAssign}' not found. Please create the role first or use an existing role.`,
      );
    }

    // Create new user
    const user = this.userRepository.create({
      username,
      email: username,
      passwordHash,
      first_name: first_name ?? null,
      last_name: last_name ?? null,
      phone_number: phone_number ?? null,
      refreshTokenHash: null,
      roles: [role],
    } as unknown as DeepPartial<User>);

    // Save to database
    const savedUser = await this.userRepository.save(user);

    // Return user without sensitive fields
    return {
      id: savedUser.id,
      username: savedUser.username,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
      phone_number: savedUser.phone_number,
      role: role.Name,
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions', 'organization'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findByIdWithOrganization(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions', 'organization'],
    });
  }

  async setRefreshTokenHash(userId: number, hash: string | null) {
    const user = await this.findById(userId);
    if (!user) return null;

    user.refreshTokenHash = hash as string;
    await this.userRepository.save(user);
    return true;
  }

  async getRefreshTokenHash(userId: number): Promise<string | null> {
    const user = await this.findById(userId);
    return user?.refreshTokenHash || null;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'organization'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const subscription = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.plan', 'plan')
      .where('subscription.user_id = :userId', { userId: id })
      .andWhere('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .getOne();

    return {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      email: user.email || user.username,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      profile_image: user.profile_image,
      address_line_1: user.address_line_1,
      address_line_2: user.address_line_2,
      city: user.city,
      state: user.state,
      country: user.country,
      zip_code: user.zip_code,
      roles: user.roles.map((r) => r.Name),
      organization: user.organization
        ? {
            id: user.organization.id,
            name: user.organization.name,
            // subdomain: user.organization.subdomain,
            // domain: user.organization.domain,
          }
        : null,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            start_date: subscription.start_date,
            end_date: subscription.end_date,
            plan: {
              id: subscription.plan.id,
              name: subscription.plan.name,
              display_name: subscription.plan.display_name,
              plan_type: subscription.plan.plan_type,
              price: subscription.plan.price,
            },
          }
        : null,
    };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);

    return {
      id: saved.id,
      username: saved.username,
      first_name: saved.first_name,
      last_name: saved.last_name,
      phone_number: saved.phone_number,
      email: saved.email,
      date_of_birth: saved.date_of_birth,
      gender: saved.gender,
      profile_image: saved.profile_image,
      address_line_1: saved.address_line_1,
      address_line_2: saved.address_line_2,
      city: saved.city,
      state: saved.state,
      country: saved.country,
      zip_code: saved.zip_code,
    };
  }

  async findAll(filterDto: UserFilterDto) {
    const { search, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Global search filter - searches across multiple fields
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.where(
        '(user.username LIKE :search OR user.first_name LIKE :search OR user.last_name LIKE :search OR user.phone_number LIKE :search)',
        { search: searchTerm },
      );
    }

    // Get total count and paginated data
    const [users, total] = await queryBuilder
      .leftJoinAndSelect('user.organization', 'organization')
      .orderBy('user.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Get active subscriptions for all users
    const userIds = users.map((u) => u.id);
    const subscriptionMap = new Map<number, UserSubscription>();
    if (userIds.length > 0) {
      const allSubscriptions = await this.subscriptionRepository
        .createQueryBuilder('subscription')
        .leftJoinAndSelect('subscription.plan', 'plan')
        .where('subscription.user_id IN (:...userIds)', { userIds })
        .andWhere('subscription.status = :status', {
          status: SubscriptionStatus.ACTIVE,
        })
        .getMany();

      allSubscriptions.forEach((sub) => {
        subscriptionMap.set(sub.user_id, sub);
      });
    }

    return {
      data: users.map((u) => {
        const subscription = subscriptionMap.get(u.id);
        return {
          id: u.id,
          username: u.username,
          first_name: u.first_name,
          last_name: u.last_name,
          phone_number: u.phone_number,
          organization: u.organization
            ? {
                id: u.organization.id,
                name: u.organization.name,
              }
            : null,
          subscription: subscription
            ? {
                id: subscription.id,
                status: subscription.status,
                start_date: subscription.start_date,
                end_date: subscription.end_date,
                plan: {
                  id: subscription.plan.id,
                  name: subscription.plan.name,
                  display_name: subscription.plan.display_name,
                  plan_type: subscription.plan.plan_type,
                  price: subscription.plan.price,
                },
              }
            : null,
        };
      }),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addUser(
    username: string,
    password: string,
    creatorOrganizationId: number,
    roleName: string,
    first_name?: string,
    last_name?: string,
    phone_number?: string,
  ) {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: creatorOrganizationId },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Find the role scoped to the creator's organization
    const role = await this.roleRepository.findOne({
      where: { Name: roleName, organization: { id: creatorOrganizationId } },
    });
    if (!role) {
      throw new NotFoundException(
        `Role '${roleName}' not found in your organization`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const passwordHash = (await (bcrypt as any).hash(password, 10)) as string;

    const user = this.userRepository.create({
      username,
      email: username,
      passwordHash,
      first_name: first_name ?? null,
      last_name: last_name ?? null,
      phone_number: phone_number ?? null,
      organization,
      roles: [role],
    } as unknown as DeepPartial<User>);

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
      phone_number: savedUser.phone_number,
      organization_id: creatorOrganizationId,
      role: role.Name,
    };
  }
}
