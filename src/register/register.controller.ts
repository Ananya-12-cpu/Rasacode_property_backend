import { RegisterRequestDto } from './dtos/register-request.dto';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { GenericResponseDto } from './dtos/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('register')
export class RegisterController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new user with role assignment',
    description:
      'Register a new user with email (username), password, optional details, and role assignment. Defaults to "user" role if not specified.',
  })
  @ApiBody({
    type: RegisterRequestDto,
    examples: {
      super_admin: {
        summary: 'Register Super Admin',
        description: 'Register a user with super_admin role',
        value: {
          username: 'admin@example.com',
          password: 'password123',
          confirm_password: 'password123',
          first_name: 'Admin',
          last_name: 'User',
          phone_number: '+919876543210',
          role: 'super_admin',
        },
      },
      regular_user: {
        summary: 'Register Regular User',
        description: 'Register a user with default "user" role',
        value: {
          username: 'user@example.com',
          password: 'password123',
          confirm_password: 'password123',
          first_name: 'Regular',
          last_name: 'User',
          phone_number: '+919876543210',
          role: 'user',
        },
      },
      manager: {
        summary: 'Register Manager',
        description: 'Register a user with manager role',
        value: {
          username: 'manager@example.com',
          password: 'password123',
          confirm_password: 'password123',
          first_name: 'Manager',
          last_name: 'User',
          phone_number: '+919876543210',
          role: 'manager',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully with assigned role',
    schema: {
      example: {
        is_success: true,
        message: 'User registered successfully',
        data: {
          username: 'user@example.com',
          first_name: 'firstname',
          last_name: 'lastname',
          phone_number: '+919876543210',
          role: 'super_admin',
          tokens: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Passwords do not match or User already exists',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Specified role does not exist',
  })
  async register(
    @Body()
    body: RegisterRequestDto,
  ): Promise<GenericResponseDto<RegisterResponseDto>> {
    if (body.password !== body.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }
    try {
      const user = await this.authService.register(
        body.username,
        body.password,
        body.first_name,
        body.last_name,
        body.phone_number,
        body.role,
      );

      return plainToInstance(GenericResponseDto, {
        is_success: true,
        message: 'User registered successfully',
        data: plainToInstance(RegisterResponseDto, user),
      }) as GenericResponseDto<RegisterResponseDto>;
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const msg = e?.response?.message || e?.message || '';
      if (typeof msg === 'string' && msg.includes('User already exists')) {
        throw new BadRequestException('User already exists');
      }
      if (
        typeof msg === 'string' &&
        msg.includes('Role') &&
        msg.includes('not found')
      ) {
        throw new BadRequestException(msg);
      }
      throw e;
    }
  }
}
