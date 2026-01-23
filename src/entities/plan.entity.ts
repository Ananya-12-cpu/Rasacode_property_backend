import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from './role.entity';

export enum PlanType {
  BASIC = 'basic',
  PRO = 'pro',
  PROFESSIONAL = 'professional',
}

@Entity({ schema: 'dbo', name: 'Plans' })
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  display_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 20, default: 'monthly' })
  billing_cycle: string; // monthly, yearly

  @Column({ type: 'varchar', length: 20 })
  plan_type: PlanType;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column()
  role_id: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'simple-json', nullable: true })
  features: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
