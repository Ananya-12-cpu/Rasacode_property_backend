import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with global search and pagination' })
  async findAll(@Query() filterDto: UserFilterDto) {
    const result = await this.usersService.findAll(filterDto);

    return {
      is_success: true,
      message: 'Users fetched successfully',
      data: result.data,
      pagination: result.pagination,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getUserById(id);

    return {
      is_success: true,
      message: 'User fetched successfully',
      data: user,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateUser(id, updateUserDto);

    return {
      is_success: true,
      message: 'User updated successfully',
      data: user,
    };
  }
}
