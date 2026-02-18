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
  // PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
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
