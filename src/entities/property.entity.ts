import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { UserPropertyLike } from './user-property-likes.entity';

@Entity({ schema: 'dbo', name: 'RealEstateProperties', database: 'EliteDB' })
@Unique('UQ_realestateproperty_address', [
  'street_address',
  'unit_apt',
  'city',
  'state',
  'zip_code',
])
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

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

  // Images (stored as array of URLs)
  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @OneToMany(() => UserPropertyLike, (like) => like.property)
  likedByUsers: UserPropertyLike[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
