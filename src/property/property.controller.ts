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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    // private readonly propertyRepository: Repository<Property>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a property' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
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
  @ApiOperation({ summary: 'Get all properties' })
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
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', type: Number })
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
  @ApiOperation({ summary: 'Update property' })
  @ApiParam({ name: 'id', type: Number })
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
  @ApiOperation({ summary: 'Delete property' })
  @ApiParam({ name: 'id', type: Number })
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
