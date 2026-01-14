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

  // async update(id: number, dto: UpdatePropertyDto): Promise<Property> {
  //   const property = await this.propertyRepository.findOne({
  //     where: { id },
  //   });

  //   if (!property) {
  //     throw new NotFoundException(`Property with id ${id} not found`);
  //   }

  //   Object.assign(property, dto);

  //   return this.propertyRepository.save(property);
  // }

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
