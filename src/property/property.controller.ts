import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dtos/property.request.dto';
import { GenericResponseDto } from './dtos/generic-response.dto';
import { Property } from 'src/entities/property.entity';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    // private readonly propertyRepository: Repository<Property>,
  ) {}

  @Post()
  async create(
    @Body() dto: CreatePropertyDto,
  ): Promise<GenericResponseDto<Property>> {
    const property = await this.propertyService.create(dto);

    return {
      is_success: true,
      message: 'Property created successfully',
      data: property,
    };
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.propertyService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.propertyService.remove(+id);
  }
}
