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
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { RentalFilterDto } from './dto/rental-filter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Rentals')
@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // Create a new rental (super_admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  // @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a rental for a property' })
  async create(@Body() dto: CreateRentalDto, @Req() req: any) {
    const rental = await this.rentalService.create(dto, req.user.userId);
    return {
      is_success: true,
      message: 'Rental created successfully',
      data: rental,
    };
  }

  // Get all rentals (super_admin only)
  @Get()
  @ApiOperation({ summary: 'Get all rentals ' })
  async findAll(@Query() filterDto: RentalFilterDto) {
    const result = await this.rentalService.findAll(filterDto);
    return {
      is_success: true,
      message: 'Rentals fetched successfully',
      ...result,
    };
  }

  // Get current user's rentals (as tenant)
  @Get('my-rentals')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my rentals (as tenant)' })
  async findMyRentals(@Query() filterDto: RentalFilterDto, @Req() req: any) {
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

  // Get rental by ID (super_admin only)
  @Get(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  // @Roles('super_admin')
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

  // Update rental (super_admin only)
  @Put(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update rental details (super_admin)' })
  @ApiParam({ name: 'id', type: Number })
  async update(@Param('id') id: number, @Body() dto: UpdateRentalDto) {
    const rental = await this.rentalService.update(+id, dto);
    return {
      is_success: true,
      message: 'Rental updated successfully',
      data: rental,
    };
  }

  // Cancel rental (super_admin only)
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

  // Delete rental (super_admin only)
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
