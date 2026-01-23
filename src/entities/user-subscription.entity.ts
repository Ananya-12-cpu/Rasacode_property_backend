import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Plan } from './plan.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity({ schema: 'dbo', name: 'UserSubscriptions' })
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => Plan, { eager: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column()
  plan_id: number;

  @Column({ type: 'varchar', length: 20, default: SubscriptionStatus.PENDING })
  status: SubscriptionStatus;

  @Column({ type: 'varchar', length: 20, default: PaymentStatus.PENDING })
  payment_status: PaymentStatus;

  @Column({ type: 'datetime', nullable: true })
  start_date: Date;

  @Column({ type: 'datetime', nullable: true })
  end_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount_paid: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  payment_method: string; // stripe, paypal, etc.

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string; // Payment gateway transaction ID

  @Column({ default: false })
  auto_renew: boolean;

  @Column({ type: 'datetime', nullable: true })
  cancelled_at: Date;

  @Column({ type: 'text', nullable: true })
  cancellation_reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
