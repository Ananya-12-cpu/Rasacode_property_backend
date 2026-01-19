import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserFilterDto } from './dto/user-filter.dto';

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
}
