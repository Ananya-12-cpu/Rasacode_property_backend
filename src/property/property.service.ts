import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '././../entities/property.entity';
import { CreatePropertyDto } from './dtos/property.request.dto';
import { UpdatePropertyDto } from './dtos/property.update.dto';
import { PropertyFilterDto } from './dto/property-filter.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(
    dto: CreatePropertyDto,
    images: Express.Multer.File[],
  ): Promise<Property> {
    const exists = await this.propertyRepository.findOne({
      where: {
        street_address: dto.street_address,
        unit_apt: dto.unit_apt || undefined,
        city: dto.city,
        state: dto.state,
        zip_code: dto.zip_code,
      },
    });

    if (exists) {
      throw new ConflictException(
        'Property with the same address already exists',
      );
    }

    const imageUrls = images.map((file) => file.filename);

    // dto.images = imageUrls;

    const property = this.propertyRepository.create({
      ...dto,
      images: imageUrls,
    });
    return this.propertyRepository.save(property);
  }
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
  ): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    let imageNames = property.images || [];

    if (images && images.length > 0) {
      const newImages = images.map((file) => file.filename);
      imageNames = [...imageNames, ...newImages];
    }

    Object.assign(property, dto);
    property.images = imageNames;

    return this.propertyRepository.save(property);
  }

  async remove(id: number) {
    await this.propertyRepository.delete(id);
    return { message: 'Property deleted successfully' };
  }
}
