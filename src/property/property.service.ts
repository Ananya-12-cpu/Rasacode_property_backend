// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class PropertyService {}

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

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async create(dto: CreatePropertyDto): Promise<Property> {
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

    const property = this.propertyRepository.create(dto);
    return this.propertyRepository.save(property);
  }
  findAll() {
    return this.propertyRepository.find();
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

  // findOne(id: number) {
  //   return this.propertyRepository.findOne({ where: { id } });
  // }

  async update(id: number, dto: UpdatePropertyDto): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }

    Object.assign(property, dto);

    return this.propertyRepository.save(property);
  }

  async remove(id: number) {
    await this.propertyRepository.delete(id);
    return { message: 'Property deleted successfully' };
  }
}
