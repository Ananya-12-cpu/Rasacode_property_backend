import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginRequestDto } from './dtos/login.request.dto';
import { LoginDataDto } from './dtos/login.response.dto';
import { GenericResponseDto } from '../login/dtos/generic-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
  ): Promise<GenericResponseDto<LoginDataDto>> {
    const result = await this.authService.login(body.username, body.password);

    // return {
    //   is_success: true,
    //   message: 'Login successful',
    //   data: result,
    // };

    return plainToInstance(GenericResponseDto, {
      is_success: true,
      message: 'User loggedin successfully',
      data: plainToInstance(LoginDataDto, result),
    }) as GenericResponseDto<LoginDataDto>;
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @Post('logout')
  async logout(@Body() body: { userId: number }) {
    await this.authService.logout(body.userId);
    return { ok: true };
  }
}
