import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionStatusDto,
  ConfirmPaymentDto,
} from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // Create subscription (initiate payment)
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new subscription (initiate payment)' })
  async create(@Body() dto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionService.create(dto);
    return {
      is_success: true,
      message: 'Subscription created. Please complete payment.',
      data: subscription,
    };
  }

  // Confirm payment (can be called by payment webhook or manually)
  @Post(':subscription_id/confirm-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment and activate subscription' })
  @ApiParam({ name: 'subscription_id', type: Number })
  async confirmPayment(
    @Param('subscription_id') subscription_id: number,
    @Body() dto: ConfirmPaymentDto,
  ) {
    const subscription = await this.subscriptionService.confirmPayment(
      +subscription_id,
      dto,
    );
    return {
      is_success: true,
      message: 'Payment confirmed. Subscription is now active.',
      data: subscription,
    };
  }

  // Get current user's active subscription
  @Get('my-subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user active subscription' })
  async getMySubscription(@Req() req: any) {
    const userId = req.user.sub;
    const subscription =
      await this.subscriptionService.getActiveSubscription(userId);

    if (!subscription) {
      return {
        is_success: true,
        message: 'No active subscription found',
        data: null,
      };
    }

    return {
      is_success: true,
      message: 'Active subscription fetched successfully',
      data: subscription,
    };
  }

  // Get current user's subscription history
  @Get('my-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user subscription history' })
  async getMyHistory(@Req() req: any) {
    const userId = req.user.sub;
    const subscriptions =
      await this.subscriptionService.getUserSubscriptions(userId);

    return {
      is_success: true,
      message: 'Subscription history fetched successfully',
      data: subscriptions,
    };
  }

  // Cancel current user's subscription
  @Post('my-subscription/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel current user subscription' })
  async cancelMySubscription(@Req() req: any, @Body('reason') reason?: string) {
    const userId = req.user.sub;
    const activeSubscription =
      await this.subscriptionService.getActiveSubscription(userId);

    if (!activeSubscription) {
      return {
        is_success: false,
        message: 'No active subscription to cancel',
      };
    }

    const subscription = await this.subscriptionService.cancelSubscription(
      activeSubscription.id,
      reason,
    );

    return {
      is_success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    };
  }

  // ==================== ADMIN ENDPOINTS ====================

  // Get all subscriptions (Admin)
  @Get()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscriptions (Admin only)' })
  async findAll() {
    const subscriptions = await this.subscriptionService.findAll();
    return {
      is_success: true,
      message: 'Subscriptions fetched successfully',
      data: subscriptions,
    };
  }

  // Get subscription by ID (Admin)
  @Get(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id') id: number) {
    const subscription = await this.subscriptionService.findOne(+id);
    return {
      is_success: true,
      message: 'Subscription fetched successfully',
      data: subscription,
    };
  }

  // Update subscription status (Admin)
  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subscription status (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  async updateStatus(
    @Param('id') id: number,
    @Body() dto: UpdateSubscriptionStatusDto,
  ) {
    const subscription = await this.subscriptionService.updateStatus(+id, dto);
    return {
      is_success: true,
      message: 'Subscription status updated successfully',
      data: subscription,
    };
  }

  // Get user's subscriptions (Admin)
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscriptions (Admin only)' })
  @ApiParam({ name: 'userId', type: Number })
  async getUserSubscriptions(@Param('userId') userId: number) {
    const subscriptions =
      await this.subscriptionService.getUserSubscriptions(+userId);
    return {
      is_success: true,
      message: 'User subscriptions fetched successfully',
      data: subscriptions,
    };
  }

  // Cancel subscription (Admin)
  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Roles('super_admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  async cancelSubscription(
    @Param('id') id: number,
    @Body('reason') reason?: string,
  ) {
    const subscription = await this.subscriptionService.cancelSubscription(
      +id,
      reason,
    );
    return {
      is_success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    };
  }
}
