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

export enum RentalStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum RentFrequency {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  ANNUALLY = 'annually',
}

export enum SmokingPolicy {
  NOT_ALLOWED = 'not_allowed',
  ALLOWED = 'allowed',
  DESIGNATED_AREAS = 'designated_areas',
}

@Entity({ schema: 'dbo', name: 'PropertyRentals' })
export class PropertyRental {
  @PrimaryGeneratedColumn()
  id: number;

  // Rental terms
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  monthly_rent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  security_deposit: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date', nullable: true })
  end_date: string;

  @Column({ type: 'varchar', length: 20, default: RentalStatus.ACTIVE })
  status: RentalStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[] | null;

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

  // Rental listing fields
  @Column({ type: 'varchar', length: 20, nullable: true })
  rent_frequency: RentFrequency | null;

  @Column({ type: 'int', nullable: true })
  lease_duration_months: number | null;

  @Column({ type: 'date', nullable: true })
  available_from: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  smoking_policy: SmokingPolicy | null;

  @Column({ type: 'bit', default: false })
  is_furnished: boolean;

  @Column({ type: 'bit', default: false })
  pets_allowed: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  application_fee: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  move_in_fees: number | null;

  @Column({ type: 'simple-array', nullable: true })
  utilities_included: string[] | null;

  @Column({ type: 'simple-array', nullable: true })
  amenities: string[] | null;

  // Creator
  @ManyToOne(() => User, { onDelete: 'NO ACTION', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ nullable: true })
  created_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
