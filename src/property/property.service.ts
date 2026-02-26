import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '././../entities/property.entity';
import {
  PendingProperty,
  PendingPropertyStatus,
} from '../entities/pending-property.entity';
import { CreatePropertyDto } from './dtos/property.request.dto';
import { UpdatePropertyDto } from './dtos/property.update.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';
import { PendingPropertyFilterDto } from './dto/pending-property-filter.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(PendingProperty)
    private readonly pendingPropertyRepository: Repository<PendingProperty>,
  ) {}

  async create(
    dto: CreatePropertyDto,
    images: Express.Multer.File[],
    userId: number,
  ): Promise<PendingProperty> {
    // Check duplicate in approved Property table
    const existsInProperty = await this.propertyRepository.findOne({
      where: {
        street_address: dto.street_address,
        unit_apt: dto.unit_apt || undefined,
        city: dto.city,
        state: dto.state,
        zip_code: dto.zip_code,
      },
    });

    if (existsInProperty) {
      throw new ConflictException(
        'Property with the same address already exists',
      );
    }

    // Check duplicate in pending table
    const existsInPending = await this.pendingPropertyRepository.findOne({
      where: {
        street_address: dto.street_address,
        unit_apt: dto.unit_apt || undefined,
        city: dto.city,
        state: dto.state,
        zip_code: dto.zip_code,
        status: PendingPropertyStatus.PENDING,
      },
    });

    if (existsInPending) {
      throw new ConflictException(
        'A property with the same address is already pending review',
      );
    }

    const imageUrls = images.map((file) => file.filename);

    const pendingProperty = this.pendingPropertyRepository.create({
      ...dto,
      images: imageUrls,
      created_by: userId,
      status: PendingPropertyStatus.PENDING,
    });
    return this.pendingPropertyRepository.save(pendingProperty);
  }

  // --- Pending property methods ---

  async findMyPending(userId: number, filterDto: PendingPropertyFilterDto) {
    const { status, search, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const qb = this.pendingPropertyRepository
      .createQueryBuilder('pp')
      .where('pp.created_by = :userId', { userId });

    if (status) {
      qb.andWhere('pp.status = :status', { status });
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      qb.andWhere(
        '(pp.street_address LIKE :search OR pp.city LIKE :search OR pp.state LIKE :search)',
        { search: searchTerm },
      );
    }

    const [data, total] = await qb
      .orderBy('pp.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllPending(filterDto: PendingPropertyFilterDto) {
    const { status, search, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const qb = this.pendingPropertyRepository
      .createQueryBuilder('pp')
      .leftJoinAndSelect('pp.creator', 'creator');

    if (status) {
      qb.where('pp.status = :status', { status });
    } else {
      qb.where('pp.status = :status', {
        status: PendingPropertyStatus.PENDING,
      });
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      qb.andWhere(
        '(pp.street_address LIKE :search OR pp.city LIKE :search OR pp.state LIKE :search)',
        { search: searchTerm },
      );
    }

    const [data, total] = await qb
      .orderBy('pp.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: data.map((pp) => ({
        ...pp,
        creator: pp.creator
          ? {
              id: pp.creator.id,
              username: pp.creator.username,
              first_name: pp.creator.first_name,
              last_name: pp.creator.last_name,
            }
          : null,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOnePending(id: number): Promise<PendingProperty> {
    const pending = await this.pendingPropertyRepository.findOne({
      where: { id },
      relations: ['creator', 'reviewer'],
    });
    if (!pending) {
      throw new NotFoundException(`Pending property with id ${id} not found`);
    }
    return pending;
  }

  async approve(pendingId: number, reviewerId: number): Promise<Property> {
    const pending = await this.pendingPropertyRepository.findOne({
      where: { id: pendingId },
    });
    if (!pending) {
      throw new NotFoundException(
        `Pending property with id ${pendingId} not found`,
      );
    }
    if (pending.status !== PendingPropertyStatus.PENDING) {
      throw new ConflictException(
        `This property has already been ${pending.status}`,
      );
    }

    // Re-check uniqueness in Property table at approval time
    const existsInProperty = await this.propertyRepository.findOne({
      where: {
        street_address: pending.street_address,
        unit_apt: pending.unit_apt || undefined,
        city: pending.city,
        state: pending.state,
        zip_code: pending.zip_code,
      },
    });
    if (existsInProperty) {
      throw new ConflictException(
        'A property with this address already exists in approved properties',
      );
    }

    // Use transaction: copy to Property table, delete from PendingProperty
    return this.pendingPropertyRepository.manager.transaction(
      async (manager) => {
        const {
          id,
          status,
          created_by,
          creator,
          reviewed_by,
          reviewer,
          reviewed_at,
          rejection_reason,
          created_at,
          updated_at,
          ...propertyData
        } = pending;

        const property = manager.create(Property, propertyData);
        const savedProperty = await manager.save(Property, property);

        await manager.delete(PendingProperty, pendingId);

        return savedProperty;
      },
    );
  }

  async reject(
    pendingId: number,
    reviewerId: number,
    reason?: string,
  ): Promise<PendingProperty> {
    const pending = await this.pendingPropertyRepository.findOne({
      where: { id: pendingId },
    });
    if (!pending) {
      throw new NotFoundException(
        `Pending property with id ${pendingId} not found`,
      );
    }
    if (pending.status !== PendingPropertyStatus.PENDING) {
      throw new ConflictException(
        `This property has already been ${pending.status}`,
      );
    }

    pending.status = PendingPropertyStatus.REJECTED;
    pending.reviewed_by = reviewerId;
    pending.reviewed_at = new Date();
    pending.rejection_reason = reason || (null as any);

    return this.pendingPropertyRepository.save(pending);
  }

  // --- Approved property methods (unchanged) ---

  async findAll(filterDto: PropertyFilterDto) {
    const {
      search,
      min_price,
      max_price,
      bedrooms,
      page = 1,
      limit = 10,
    } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.propertyRepository.createQueryBuilder('property');

    // Global search filter - searches across multiple fields
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(property.street_address LIKE :search OR property.city LIKE :search OR property.state LIKE :search OR property.zip_code LIKE :search OR property.property_type LIKE :search OR property.property_description LIKE :search)',
        { search: searchTerm },
      );
    }

    // Min price filter
    if (min_price !== undefined) {
      queryBuilder.andWhere('property.listing_price >= :min_price', {
        min_price,
      });
    }

    // Max price filter
    if (max_price !== undefined) {
      queryBuilder.andWhere('property.listing_price <= :max_price', {
        max_price,
      });
    }

    // Bedrooms filter
    if (bedrooms !== undefined) {
      queryBuilder.andWhere('property.bedrooms = :bedrooms', { bedrooms });
    }

    // Get total count and paginated data
    const [data, total] = await queryBuilder
      .orderBy('property.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }

    return property;
  }

  async update(
    id: number,
    dto: UpdatePropertyDto,
    images?: Express.Multer.File[],
  ): Promise<PendingProperty> {
    // Pending properties can be edited
    const pending = await this.pendingPropertyRepository.findOne({
      where: { id },
    });

    if (pending) {
      if (pending.status !== PendingPropertyStatus.PENDING) {
        throw new BadRequestException(
          `Property cannot be edited because its status is '${pending.status}'`,
        );
      }

      let imageNames = pending.images || [];
      if (images && images.length > 0) {
        imageNames = [...imageNames, ...images.map((f) => f.filename)];
      }

      Object.assign(pending, dto);
      pending.images = imageNames;
      return this.pendingPropertyRepository.save(pending);
    }

    // Active (approved) properties cannot be edited
    const approved = await this.propertyRepository.findOne({ where: { id } });
    if (approved) {
      throw new BadRequestException('Active properties cannot be edited');
    }

    throw new NotFoundException(`Property with id ${id} not found`);
  }

  async remove(id: number) {
    await this.propertyRepository.delete(id);
    return { message: 'Property deleted successfully' };
  }
}
