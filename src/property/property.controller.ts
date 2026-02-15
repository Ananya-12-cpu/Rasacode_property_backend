import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { transformImageUrls } from '../common/helpers/file-url.helper';
import { RbacGuard } from 'src/rbac/guards/rbac.guard';
import { RequirePermission } from 'src/rbac/decorators/require-permission.decorator';
import { Roles } from 'src/rbac/decorators/roles.decorator';
import { PropertyFilterDto } from './dto/property-filter.dto';
import { PendingPropertyFilterDto } from './dto/pending-property-filter.dto';
import { RejectPropertyDto } from './dto/reject-property.dto';

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
  @ApiOperation({ summary: 'Submit a property for review' })
  @ApiResponse({
    status: 201,
    description: 'Property submitted for review successfully',
  })
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
    const user = (req as any).user;
    const pendingProperty = await this.propertyService.create(
      dto,
      images,
      user.id,
    );
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const propertyWithUrls = {
      ...pendingProperty,
      images: transformImageUrls(pendingProperty.images || [], baseUrl),
    };

    return {
      is_success: true,
      message:
        'Property submitted for review. It will be visible after admin approval.',
      data: propertyWithUrls,
    };
  }

  // --- Pending property endpoints (static routes before :id) ---

  @Get('my-pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my pending properties' })
  @ApiResponse({ status: 200, description: 'Pending properties fetched' })
  async findMyPending(
    @Query() filterDto: PendingPropertyFilterDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const result = await this.propertyService.findMyPending(
      user.id,
      filterDto,
    );
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const dataWithUrls = result.data.map((p) => ({
      ...p,
      images: transformImageUrls(p.images || [], baseUrl),
    }));

    return {
      is_success: true,
      message: 'My pending properties fetched successfully',
      data: dataWithUrls,
      pagination: result.meta,
    };
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pending properties (super_admin only)' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'approved', 'rejected'],
    description: 'Filter by status (defaults to pending)',
  })
  @ApiResponse({ status: 200, description: 'Pending properties fetched' })
  async findAllPending(
    @Query() filterDto: PendingPropertyFilterDto,
    @Req() req: Request,
  ) {
    const result = await this.propertyService.findAllPending(filterDto);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const dataWithUrls = result.data.map((p) => ({
      ...p,
      images: transformImageUrls(p.images || [], baseUrl),
    }));

    return {
      is_success: true,
      message: 'Pending properties fetched successfully',
      data: dataWithUrls,
      pagination: result.meta,
    };
  }

  @Get('pending/:id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get pending property by ID (super_admin only)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Pending property fetched' })
  async findOnePending(@Param('id') id: number, @Req() req: Request) {
    const pending = await this.propertyService.findOnePending(+id);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      is_success: true,
      message: 'Pending property fetched successfully',
      data: {
        ...pending,
        images: transformImageUrls(pending.images || [], baseUrl),
        creator: pending.creator
          ? {
              id: pending.creator.id,
              username: pending.creator.username,
              first_name: pending.creator.first_name,
              last_name: pending.creator.last_name,
            }
          : null,
        reviewer: pending.reviewer
          ? {
              id: pending.reviewer.id,
              username: pending.reviewer.username,
            }
          : null,
      },
    };
  }

  @Post('pending/:id/approve')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a pending property (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Property approved and published',
  })
  async approve(@Param('id') id: number, @Req() req: Request) {
    const user = (req as any).user;
    const property = await this.propertyService.approve(+id, user.id);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      is_success: true,
      message: 'Property approved and published successfully',
      data: {
        ...property,
        images: transformImageUrls(property.images || [], baseUrl),
      },
    };
  }

  @Post('pending/:id/reject')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a pending property (super_admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Property rejected' })
  async reject(
    @Param('id') id: number,
    @Body() dto: RejectPropertyDto,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const pending = await this.propertyService.reject(
      +id,
      user.id,
      dto.rejection_reason,
    );
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return {
      is_success: true,
      message: 'Property rejected',
      data: {
        ...pending,
        images: transformImageUrls(pending.images || [], baseUrl),
      },
    };
  }

  // --- Approved property endpoints (unchanged) ---

  @Get()
  @ApiOperation({
    summary: 'Get all properties with global search, filters and pagination',
  })
  async findAll(@Query() filterDto: PropertyFilterDto, @Req() req: Request) {
    const result = await this.propertyService.findAll(filterDto);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Transform image filenames to full URLs
    const propertiesWithUrls = result.data.map((property) => ({
      ...property,
      images: transformImageUrls(property.images || [], baseUrl),
    }));

    return {
      is_success: true,
      message: 'Properties fetched successfully',
      data: propertiesWithUrls,
      pagination: result.meta,
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
