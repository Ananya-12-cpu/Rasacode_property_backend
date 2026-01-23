import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import {
  PaymentStatus,
  SubscriptionStatus,
} from '../../entities/user-subscription.entity';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Plan ID',
    example: 1,
  })
  @IsNumber()
  plan_id: number;

  @ApiPropertyOptional({
    description: 'Payment method used',
    example: 'stripe',
  })
  @IsString()
  @IsOptional()
  payment_method?: string;

  @ApiPropertyOptional({
    description: 'Transaction ID from payment gateway',
    example: 'txn_123456789',
  })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiPropertyOptional({
    description: 'Amount paid',
    example: 29.99,
  })
  @IsNumber()
  @IsOptional()
  amount_paid?: number;

  @ApiPropertyOptional({
    description: 'Enable auto-renewal',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  auto_renew?: boolean;
}

export class UpdateSubscriptionStatusDto {
  @ApiProperty({
    description: 'Subscription status',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  payment_status?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Cancellation reason (if cancelling)',
    example: 'No longer needed',
  })
  @IsString()
  @IsOptional()
  cancellation_reason?: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'Transaction ID from payment gateway',
    example: 'txn_123456789',
  })
  @IsString()
  transaction_id: string;

  @ApiProperty({
    description: 'Payment method used',
    example: 'stripe',
  })
  @IsString()
  payment_method: string;

  @ApiProperty({
    description: 'Amount paid',
    example: 29.99,
  })
  @IsNumber()
  amount_paid: number;
}
