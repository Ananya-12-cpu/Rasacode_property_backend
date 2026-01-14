import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dtos/property.request.dto';
import { GenericResponseDto } from './dtos/generic-response.dto';
import { Property } from 'src/entities/property.entity';
import { UpdatePropertyDto } from './dtos/property.update.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { transformImageUrls } from '../common/helpers/file-url.helper';
import { RbacGuard } from 'src/rbac/guards/rbac.guard';
import { RequirePermission } from 'src/rbac/decorators/require-permission.decorator';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    // private readonly propertyRepository: Repository<Property>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'properties', action: 'add' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a property' })
  @ApiResponse({ status: 201, description: 'Property created successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.originalname.split('.')[0] +
              '-' +
              uniqueName +
              extname(file.originalname),
          );
        },
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        listing_date: { type: 'string', example: '2025-01-01' },
        listing_price: { type: 'number', example: 450000 },
        asking_price: { type: 'number', example: 470000 },
        street_address: { type: 'string' },
        unit_apt: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zip_code: { type: 'string' },
        county: { type: 'string' },
        property_type: { type: 'string' },
        bedrooms: { type: 'number' },
        bathrooms: { type: 'number' },
        square_feet: { type: 'number' },
        lot_size: { type: 'string' },
        year_built: { type: 'number' },
        garage_spaces: { type: 'number' },
        parking_spaces: { type: 'number' },
        roof_age: { type: 'string' },
        roof_status: { type: 'string' },
        interior_condition: { type: 'string' },
        exterior_paint_required: { type: 'boolean' },
        new_floor_required: { type: 'boolean' },
        kitchen_renovation_required: { type: 'boolean' },
        bathroom_renovation_required: { type: 'boolean' },
        drywall_repair_required: { type: 'boolean' },
        interior_paint_required: { type: 'boolean' },
        arv: { type: 'number' },
        repair_estimate: { type: 'number' },
        holding_costs: { type: 'number' },
        transaction_type: { type: 'string' },
        assignment_fee: { type: 'number' },
        property_description: { type: 'string' },
        seller_notes: { type: 'string' },

        // 🔥 FILE FIELD
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async create(
    @Body() dto: CreatePropertyDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const property = await this.propertyService.create(dto, images);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Transform image filenames to full URLs
    const propertyWithUrls = {
      ...property,
      images: transformImageUrls(property.images || [], baseUrl),
    };

    return {
      is_success: true,
      message: 'Property created successfully',
      data: propertyWithUrls,
    };
  }

  // GET ALL
  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  async findAll(@Req() req: Request): Promise<GenericResponseDto<Property[]>> {
    const properties = await this.propertyService.findAll();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Transform image filenames to full URLs
    const propertiesWithUrls = properties.map((property) => ({
      ...property,
      images: transformImageUrls(property.images || [], baseUrl),
    }));

    return {
      is_success: true,
      message: 'Properties fetched successfully',
      data: propertiesWithUrls,
    };
  }

  // GET BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<GenericResponseDto<Property>> {
    const property = await this.propertyService.findOne(+id);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Transform image filenames to full URLs
    const propertyWithUrls = {
      ...property,
      images: transformImageUrls(property.images || [], baseUrl),
    };

    return {
      is_success: true,
      message: 'Property fetched successfully',
      data: propertyWithUrls,
    };
  }

  //UPDATE
  @Put(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'properties', action: 'edit' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update property' })
  @ApiParam({ name: 'id', type: Number })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/properties',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.originalname.split('.')[0] +
              '-' +
              uniqueName +
              extname(file.originalname),
          );
        },
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        listing_date: { type: 'string', example: '2025-01-01' },
        listing_price: { type: 'number' },
        asking_price: { type: 'number' },
        street_address: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zip_code: { type: 'string' },
        bedrooms: { type: 'number' },
        bathrooms: { type: 'number' },
        square_feet: { type: 'number' },
        property_description: { type: 'string' },

        // 🔥 FILE FIELD
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePropertyDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: Request,
  ): Promise<GenericResponseDto<Property>> {
    const property = await this.propertyService.update(+id, dto, images);

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      is_success: true,
      message: 'Property updated successfully',
      data: {
        ...property,
        images: transformImageUrls(property.images || [], baseUrl),
      },
    };
  }

  // DELETE
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'properties', action: 'delete' })
  @ApiBearerAuth()
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
}
