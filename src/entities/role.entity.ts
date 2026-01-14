import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Permission } from './permission.entity';
import type { User } from './user.entity';

@Entity({ schema: 'dbo', name: 'Roles' })
export class Role {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column({ unique: true })
  Name: string;

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];

  @ManyToMany('User', (user: User) => user.roles)
  users: User[];
}
