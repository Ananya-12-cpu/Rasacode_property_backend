import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dtos/property.request.dto';
import { GenericResponseDto } from './dtos/generic-response.dto';
import { Property } from 'src/entities/property.entity';
import { UpdatePropertyDto } from './dtos/property.update.dto';

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

  // GET ALL
  @Get()
  async findAll(): Promise<GenericResponseDto<Property[]>> {
    const properties = await this.propertyService.findAll();

    return {
      is_success: true,
      message: 'Properties fetched successfully',
      data: properties,
    };
  }

  // GET BY ID
  @Get(':id')
  async findOne(
    @Param('id') id: number,
  ): Promise<GenericResponseDto<Property>> {
    const property = await this.propertyService.findOne(+id);

    return {
      is_success: true,
      message: 'Property fetched successfully',
      data: property,
    };
  }

  //UPDATE
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePropertyDto,
  ): Promise<GenericResponseDto<Property>> {
    const property = await this.propertyService.update(+id, dto);

    return {
      is_success: true,
      message: 'Property updated successfully',
      data: property,
    };
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<GenericResponseDto<null>> {
    await this.propertyService.remove(+id);

    return {
      is_success: true,
      message: 'Property deleted successfully',
      data: null,
    };
  }

  // @Get()
  // findAll() {
  //   return this.propertyService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.propertyService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.propertyService.remove(+id);
  // }
}
