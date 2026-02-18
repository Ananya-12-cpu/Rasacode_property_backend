import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PropertyRental,
  RentalStatus,
} from '../entities/property-rental.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(PropertyRental)
    private readonly rentalRepository: Repository<PropertyRental>,
  ) {}

  async create(
    dto: CreateRentalDto,
    createdBy: number,
    images?: Express.Multer.File[],
  ): Promise<PropertyRental> {
    // Check for duplicate active rental at the same address
    const duplicate = await this.rentalRepository.findOne({
      where: {
        street_address: dto.street_address,
        city: dto.city,
        state: dto.state,
        zip_code: dto.zip_code,
        status: RentalStatus.ACTIVE,
      },
    });
    if (duplicate) {
      throw new BadRequestException(
        'An active rental already exists for this address',
      );
    }

    const imageUrls = images?.map((f) => f.filename) ?? [];

    const rental = this.rentalRepository.create({
      ...dto,
      images: imageUrls.length > 0 ? imageUrls : null,
      created_by: createdBy,
      status: RentalStatus.ACTIVE,
    });
    return this.rentalRepository.save(rental);
  }

  async findAll(filterDto: RentalFilterDto) {
    const { status, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const qb = this.rentalRepository
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.creator', 'creator');

    if (status) {
      qb.where('rental.status = :status', { status });
    }

    const [data, total] = await qb
      .orderBy('rental.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: data.map((r) => this.formatRental(r)),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMyRentals(userId: number, filterDto: RentalFilterDto) {
    const { status, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const qb = this.rentalRepository
      .createQueryBuilder('rental')
      .where('rental.created_by = :userId', { userId });

    if (status) {
      qb.andWhere('rental.status = :status', { status });
    }

    const [data, total] = await qb
      .orderBy('rental.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: data.map((r) => this.formatRental(r)),
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<PropertyRental> {
    const rental = await this.rentalRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
    if (!rental) {
      throw new NotFoundException(`Rental with ID ${id} not found`);
    }
    return rental;
  }

  async update(
    id: number,
    dto: UpdateRentalDto,
    images?: Express.Multer.File[],
  ): Promise<PropertyRental> {
    const rental = await this.findOne(id);

    if (rental.status === RentalStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled rental');
    }

    const imageUrls = images?.map((f) => f.filename) ?? [];
    Object.assign(rental, dto);
    if (imageUrls.length > 0) {
      rental.images = imageUrls;
    }

    return this.rentalRepository.save(rental);
  }

  async cancel(id: number): Promise<PropertyRental> {
    const rental = await this.findOne(id);

    if (rental.status === RentalStatus.CANCELLED) {
      throw new BadRequestException('Rental is already cancelled');
    }

    rental.status = RentalStatus.CANCELLED;
    return this.rentalRepository.save(rental);
  }

  async remove(id: number): Promise<void> {
    const rental = await this.findOne(id);
    await this.rentalRepository.remove(rental);
  }

  private formatRental(rental: PropertyRental) {
    return {
      id: rental.id,
      status: rental.status,
      monthly_rent: rental.monthly_rent,
      security_deposit: rental.security_deposit,
      start_date: rental.start_date,
      end_date: rental.end_date,
      notes: rental.notes,
      street_address: rental.street_address,
      unit_apt: rental.unit_apt,
      city: rental.city,
      state: rental.state,
      zip_code: rental.zip_code,
      county: rental.county,
      property_type: rental.property_type,
      bedrooms: rental.bedrooms,
      bathrooms: rental.bathrooms,
      square_feet: rental.square_feet,
      lot_size: rental.lot_size,
      year_built: rental.year_built,
      garage_spaces: rental.garage_spaces,
      parking_spaces: rental.parking_spaces,
      roof_age: rental.roof_age,
      roof_status: rental.roof_status,
      created_at: rental.created_at,
      created_by: rental.creator
        ? { id: rental.creator.id, username: rental.creator.username }
        : null,
    };
  }
}
