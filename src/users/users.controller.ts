import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Req,
  Request as NestRequest,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { RequirePermission } from '../rbac/decorators/require-permission.decorator';
import { UsersService } from './users.service';
import { UserFilterDto } from './dto/user-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddUserDto } from './dto/add-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @ApiBearerAuth()
  @RequirePermission({ resource: 'user_management', action: 'add' })
  @ApiOperation({ summary: 'Add a new user to your organization' })
  async addUser(@Body() dto: AddUserDto, @NestRequest() req: any) {
    const creatorOrgId = req.user?.organization_id;
    if (!creatorOrgId) {
      throw new ForbiddenException('You are not attached to any organization');
    }

    const data = await this.usersService.addUser(
      dto.username,
      dto.password,
      creatorOrgId,
      dto.role,
      dto.first_name,
      dto.last_name,
      dto.phone_number,
    );

    return {
      is_success: true,
      message: 'User added successfully',
      data,
    };
  }

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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        phone_number: { type: 'string' },
        email: { type: 'string' },
        date_of_birth: { type: 'string', format: 'date' },
        gender: { type: 'string' },
        address_line_1: { type: 'string' },
        address_line_2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        country: { type: 'string' },
        zip_code: { type: 'string' },
        profile_image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('profile_image', {
      storage: diskStorage({
        destination: './uploads/users',

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
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(new Error('Only image files are allowed'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Req() req: Request,
  ) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if (file) {
      updateUserDto.profile_image = `${baseUrl}/uploads/users/${file.filename}`;
    }

    const user = await this.usersService.updateUser(id, updateUserDto);

    return {
      is_success: true,
      message: 'User updated successfully',
      data: user,
    };
  }
}
