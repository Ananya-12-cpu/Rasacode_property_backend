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

export enum PendingPropertyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity({ schema: 'dbo', name: 'PendingRealEstateProperties' })
export class PendingProperty {
  @PrimaryGeneratedColumn()
  id: number;

  // Workflow metadata
  @Column({
    type: 'varchar',
    length: 20,
    default: PendingPropertyStatus.PENDING,
  })
  status: PendingPropertyStatus;

  @Column()
  created_by: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ nullable: true })
  reviewed_by: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column({ type: 'datetime2', nullable: true })
  reviewed_at: Date;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string;

  // Listing info
  @Column({ type: 'date', nullable: true })
  listing_date: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  listing_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  asking_price: number;

  // Address
  @Column({ nullable: true })
  street_address: string;

  @Column({ nullable: true })
  unit_apt: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip_code: string;

  @Column({ nullable: true })
  county: string;

  // Property details
  @Column({ nullable: true })
  property_type: string;

  @Column({ type: 'int', nullable: true })
  bedrooms: number;

  @Column({ type: 'int', nullable: true })
  bathrooms: number;

  @Column({ type: 'int', nullable: true })
  square_feet: number;

  @Column({ nullable: true })
  lot_size: string;

  @Column({ type: 'int', nullable: true })
  year_built: number;

  @Column({ type: 'int', default: 0 })
  garage_spaces: number;

  @Column({ type: 'int', default: 0 })
  parking_spaces: number;

  // Property condition
  @Column({ nullable: true })
  roof_age: string;

  @Column({ nullable: true })
  roof_status: string;

  @Column({ nullable: true })
  interior_condition: string;

  @Column({ default: false })
  exterior_paint_required: boolean;

  @Column({ default: false })
  new_floor_required: boolean;

  @Column({ default: false })
  kitchen_renovation_required: boolean;

  @Column({ default: false })
  bathroom_renovation_required: boolean;

  @Column({ default: false })
  drywall_repair_required: boolean;

  @Column({ default: false })
  interior_paint_required: boolean;

  // Financial
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  arv: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  repair_estimate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  holding_costs: number;

  @Column({ nullable: true })
  transaction_type: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  assignment_fee: number;

  // Notes
  @Column({ type: 'text', nullable: true })
  property_description: string;

  @Column({ type: 'text', nullable: true })
  seller_notes: string;

  // Images
  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
