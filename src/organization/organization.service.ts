import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationFilterDto,
} from './dtos/organization.request.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    if (dto.subdomain) {
      const exists = await this.organizationRepository.findOne({
        where: { subdomain: dto.subdomain },
      });
      if (exists) {
        throw new ConflictException(
          'Organization with this subdomain already exists',
        );
      }
    }

    const organization = this.organizationRepository.create(dto);
    return this.organizationRepository.save(organization);
  }

  async findAll(filterDto: OrganizationFilterDto) {
    const { search, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder =
      this.organizationRepository.createQueryBuilder('organization');

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.where(
        '(organization.name LIKE :search OR organization.subdomain LIKE :search OR organization.domain LIKE :search OR organization.industry LIKE :search)',
        { search: searchTerm },
      );
    }

    const [data, total] = await queryBuilder
      .orderBy('organization.created_at', 'DESC')
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

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findOne(id);

    if (dto.subdomain && dto.subdomain !== organization.subdomain) {
      const exists = await this.organizationRepository.findOne({
        where: { subdomain: dto.subdomain },
      });
      if (exists) {
        throw new ConflictException(
          'Organization with this subdomain already exists',
        );
      }
    }

    Object.assign(organization, dto);
    return this.organizationRepository.save(organization);
  }

  async remove(id: string): Promise<void> {
    const organization = await this.findOne(id);
    await this.organizationRepository.remove(organization);
  }
}
