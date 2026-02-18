import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

const rentalImageStorage = diskStorage({
  destination: './uploads/rentals',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + extname(file.originalname));
  },
});

@ApiTags('Rentals')
@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a rental for a property' })
  @UseInterceptors(
    FilesInterceptor('images', 10, { storage: rentalImageStorage }),
  )
  async create(
    @Body() dto: CreateRentalDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req: { user: { userId: number } },
  ) {
    const rental = await this.rentalService.create(
      dto,
      req.user.userId,
      images,
    );
    return {
      is_success: true,
      message: 'Rental created successfully',
      data: rental,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all rentals' })
  async findAll(@Query() filterDto: RentalFilterDto) {
    const result = await this.rentalService.findAll(filterDto);
    return {
      is_success: true,
      message: 'Rentals fetched successfully',
      ...result,
    };
  }

  @Get('my-rentals')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my rentals' })
  async findMyRentals(
    @Query() filterDto: RentalFilterDto,
    @Req() req: { user: { userId: number } },
  ) {
    const result = await this.rentalService.findMyRentals(
      req.user.userId,
      filterDto,
    );
    return {
      is_success: true,
      message: 'My rentals fetched successfully',
      ...result,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rental by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id') id: number) {
    const rental = await this.rentalService.findOne(+id);
    return {
      is_success: true,
      message: 'Rental fetched successfully',
      data: rental,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update rental details (super_admin)' })
  @ApiParam({ name: 'id', type: Number })
  @UseInterceptors(
    FilesInterceptor('images', 10, { storage: rentalImageStorage }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateRentalDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const rental = await this.rentalService.update(+id, dto, images);
    return {
      is_success: true,
      message: 'Rental updated successfully',
      data: rental,
    };
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a rental (super_admin)' })
  @ApiParam({ name: 'id', type: Number })
  async cancel(@Param('id') id: number) {
    const rental = await this.rentalService.cancel(+id);
    return {
      is_success: true,
      message: 'Rental cancelled successfully',
      data: rental,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a rental (super_admin)' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id') id: number) {
    await this.rentalService.remove(+id);
    return {
      is_success: true,
      message: 'Rental deleted successfully',
    };
  }
}
