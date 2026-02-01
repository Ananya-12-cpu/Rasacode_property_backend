import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { ContactFilterDto } from './dto/contact-filter.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(filterDto: ContactFilterDto) {
    const { search, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'role');

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.where(
        '(user.username LIKE :search OR user.first_name LIKE :search OR user.last_name LIKE :search OR user.phone_number LIKE :search)',
        { search: searchTerm },
      );
    }

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
        roles: u.roles.map((r) => r.Name),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || !user.roles || user.roles.length === 0) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      roles: user.roles.map((r) => ({
        name: r.Name,
        role_title: r.role_title,
      })),
    };
  }

  async create(dto: CreateContactDto) {
    const existingUser = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new BadRequestException('User with this username already exists');
    }

    const role = await this.roleRepository.findOne({
      where: { Name: dto.role },
    });

    if (!role) {
      throw new NotFoundException(`Role '${dto.role}' not found`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      username: dto.username,
      passwordHash,
      first_name: dto.first_name ?? null,
      last_name: dto.last_name ?? null,
      phone_number: dto.phone_number ?? null,
      roles: [role],
    } as unknown as User);

    const saved = await this.userRepository.save(user);

    return {
      id: saved.id,
      username: saved.username,
      first_name: saved.first_name,
      last_name: saved.last_name,
      phone_number: saved.phone_number,
      role: role.Name,
    };
  }

  async update(id: number, dto: UpdateContactDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user || !user.roles || user.roles.length === 0) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    if (dto.first_name !== undefined) user.first_name = dto.first_name;
    if (dto.last_name !== undefined) user.last_name = dto.last_name;
    if (dto.phone_number !== undefined) user.phone_number = dto.phone_number;

    if (dto.role) {
      const role = await this.roleRepository.findOne({
        where: { Name: dto.role },
      });

      if (!role) {
        throw new NotFoundException(`Role '${dto.role}' not found`);
      }

      user.roles = [role];
    }

    const saved: User = await this.userRepository.save(user);

    return {
      id: saved.id,
      username: saved.username,
      first_name: saved.first_name,
      last_name: saved.last_name,
      phone_number: saved.phone_number,
      roles: saved.roles.map((r) => r.Name),
    };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user || !user.roles || user.roles.length === 0) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    await this.userRepository.remove(user);
  }
}
