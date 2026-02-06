import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Permission } from './permission.entity';
import type { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity({ schema: 'dbo', name: 'Roles' })
export class Role {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Name: string;

  @Column({ nullable: true })
  role_title: string;

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];

  @ManyToMany('User', (user: User) => user.roles)
  users: User[];

  @ManyToOne(() => Organization, (organization) => organization.roles, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
