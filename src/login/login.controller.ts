import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginRequestDto } from './dtos/login.request.dto';
import { LoginDataDto } from './dtos/login.response.dto';
import { GenericResponseDto } from '../login/dtos/generic-response.dto';
import { plainToInstance } from 'class-transformer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Login with email (username) and password',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
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

  // @Post('refresh')
  // async refresh(@Body() body: { userId: number; refreshToken: string }) {
  //   return this.authService.refreshTokens(body.userId, body.refreshToken);
  // }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Req() req: any) {
    const userId = req.user.userId;
    console.log(userId);

    await this.authService.logout(userId);
    return { is_success: true, message: 'Logged out successfully' };
  }
}
