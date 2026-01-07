import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'dbo', name: 'Campaigns' })
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  // --------------------
  // Basic Campaign Info
  // --------------------
  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  campaign_type: string;

  @Column({ type: 'simple-array' })
  channel: string[];

  // --------------------
  // Schedule
  // --------------------
  @Column({ type: 'date' })
  scheduled_start_date: string;

  @Column({ type: 'date' })
  scheduled_end_date: string;

  @Column({ length: 5 })
  scheduled_start_time: string;

  @Column({ length: 5 })
  scheduled_end_time: string;

  // --------------------
  // Email / Messaging
  // --------------------
  @Column({ length: 150 })
  subject_line: string;

  @Column({ type: 'text' })
  email_content: string;

  // --------------------
  // Status & Flags
  // --------------------
  @Column({
    type: 'varchar',
    length: 20,
    default: 'draft',
  })
  status: string;

  @Column({ type: 'bit', default: false })
  use_ai_personalization?: boolean;

  // --------------------
  // Geographic Scope
  // --------------------
  @Column({ nullable: true, length: 20 })
  geographic_scope_type?: string;

  @Column({ nullable: true })
  property_type?: string;

  // --------------------
  // Price Range
  // --------------------
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  min_price?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  max_price?: number;

  // --------------------
  // Distress Indicators
  // --------------------
  @Column({ type: 'simple-array', nullable: true })
  distress_indicators?: string[];

  // --------------------
  // Buyer Finder – Demographics
  // --------------------
  @Column({ nullable: true })
  last_qualification?: string;

  @Column({ nullable: true })
  age_range?: string;

  @Column({ nullable: true })
  ethnicity?: string;

  @Column({ nullable: true })
  salary_range?: string;

  @Column({ nullable: true })
  marital_status?: string;

  @Column({ nullable: true })
  employment_status?: string;

  @Column({ nullable: true })
  home_ownership_status?: string;

  // --------------------
  // Buyer Geography
  // --------------------
  @Column({ nullable: true })
  buyer_country?: string;

  @Column({ nullable: true })
  buyer_state?: string;

  @Column({ nullable: true })
  buyer_counties?: string;

  @Column({ nullable: true })
  buyer_city?: string;

  @Column({ nullable: true })
  buyer_districts?: string;

  @Column({ nullable: true })
  buyer_parish?: string;

  // --------------------
  // Seller Geography
  // --------------------
  @Column({ nullable: true })
  seller_country?: string;

  @Column({ nullable: true })
  seller_state?: string;

  @Column({ nullable: true })
  seller_counties?: string;

  @Column({ nullable: true })
  seller_city?: string;

  @Column({ nullable: true })
  seller_districts?: string;

  @Column({ nullable: true })
  seller_parish?: string;

  // --------------------
  // Seller Extra
  // --------------------
  @Column({ type: 'varchar', length: 1000, nullable: true })
  seller_keywords?: string;

  // --------------------
  // Audit
  // --------------------
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
