import { RegisterRequestDto } from './dtos/register-request.dto';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { GenericResponseDto } from './dtos/generic-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('register')
export class RegisterController {
  constructor(private readonly authService: AuthService) {}

  @Post()
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
      throw e;
    }
  }
}
