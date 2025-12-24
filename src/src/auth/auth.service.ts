import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async getTokens(userId: number, username: string) {
    const payload = { sub: userId, username };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.accessSecret,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Register a new user with the given credentials.
   * @param username the username for the new user
   * @param password the password for the new user
   * @param first_name the first name for the new user (optional)
   * @param last_name the last name for the new user (optional)
   * @param phone_number the phone number for the new user (optional)
   * @returns an object containing the new user's credentials and tokens
   */
  /*******  a622303a-7b68-44de-9169-f8b2c9fbdd70  *******/
  async register(
    username: string,
    password: string,
    first_name?: string,
    last_name?: string,
    phone_number?: string,
  ) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(
      username,
      passwordHash,
      first_name,
      last_name,
      phone_number,
    );
    const tokens = await this.getTokens(user.id, user.username);
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.setRefreshTokenHash(user.id, refreshHash);
    return {
      username: user.username,
      password,
      first_name: user.first_name ?? first_name ?? null,
      last_name: user.last_name ?? last_name ?? null,
      phone_number: user.phone_number ?? phone_number ?? null,
      tokens,
    };
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.getTokens(user.id, user.username);
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.setRefreshTokenHash(user.id, refreshHash);
    // return tokens;
    return {
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        phone_number: user.phone_number ?? null,
      },
      tokens,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const stored = await this.usersService.getRefreshTokenHash(userId);
    if (!stored) throw new UnauthorizedException('Refresh token not found');

    // verify token signature and payload
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      if (payload.sub !== userId)
        throw new UnauthorizedException('Invalid token');
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await bcrypt.compare(refreshToken, stored);
    if (!matches) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const tokens = await this.getTokens(user.id, user.username);
    const newRefreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.setRefreshTokenHash(user.id, newRefreshHash);
    return tokens;
  }

  async logout(userId: number) {
    await this.usersService.setRefreshTokenHash(userId, null);
  }
}
