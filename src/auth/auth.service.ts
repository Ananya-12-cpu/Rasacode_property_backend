import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './jwt.constants';
import {
  UserSubscription,
  SubscriptionStatus,
} from '../entities/user-subscription.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserSubscription)
    private readonly subscriptionRepository: Repository<UserSubscription>,
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

  async register(
    username: string,
    password: string,
    first_name?: string,
    last_name?: string,
    phone_number?: string,
    role?: string,
  ) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(
      username,
      passwordHash,
      first_name,
      last_name,
      phone_number,
      role,
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
      role: user.role,
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

    // Get user's active subscription with plan details
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        user_id: user.id,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan', 'plan.role', 'plan.role.permissions'],
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        phone_number: user.phone_number ?? null,
        roles: user.roles?.map((r) => r.Name) ?? [],
        organization: user.organization
          ? { id: user.organization.id, name: user.organization.name }
          : null,
      },
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            start_date: subscription.start_date,
            end_date: subscription.end_date,
            plan: {
              id: subscription.plan.id,
              name: subscription.plan.name,
              display_name: subscription.plan.display_name,
              plan_type: subscription.plan.plan_type,
              price: subscription.plan.price,
              billing_cycle: subscription.plan.billing_cycle,
              features: subscription.plan.features,
            },
          }
        : null,
      tokens,
    };
  }

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Refresh the user's tokens with the given refresh token.
   * @param userId the id of the user to refresh tokens for
   * @param refreshToken the refresh token to verify and use
   * @returns an object containing the new access and refresh tokens
   * @throws UnauthorizedException if the refresh token is invalid or not found
   */
  /*******  349f6b7f-b815-4417-94d2-f7bb21ebb27f  *******/
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
