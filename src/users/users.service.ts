// users/users.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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

    // Get role - default to 'user' if not specified
    const roleToAssign = roleName || 'user';
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
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
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
      .orderBy('user.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: users.map((u) => ({
        id: u.id,
        username: u.username,
        first_name: u.first_name,
        last_name: u.last_name,
        phone_number: u.phone_number,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
