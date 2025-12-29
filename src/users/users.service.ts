// users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    username: string,
    passwordHash: string,
    first_name?: string,
    last_name?: string,
    phone_number?: string,
  ) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Create new user
    const user = this.userRepository.create({
      username,
      passwordHash,
      first_name: first_name ?? null,
      last_name: last_name ?? null,
      phone_number: phone_number ?? null,
      refreshTokenHash: null,
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
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
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

  async findAll() {
    // Get all users and return without sensitive fields
    const users = await this.userRepository.find();

    return users.map((u) => ({
      id: u.id,
      username: u.username,
      first_name: u.first_name,
      last_name: u.last_name,
      phone_number: u.phone_number,
    }));
  }
}
