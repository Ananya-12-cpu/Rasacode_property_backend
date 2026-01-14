import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';

export interface ResourcePermission {
  add: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface PermissionStructure {
  campaign: ResourcePermission;
  properties: ResourcePermission;
}

@Entity({ schema: 'dbo', name: 'Permissions' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;

  @Column('simple-json')
  permissions: PermissionStructure;
}
