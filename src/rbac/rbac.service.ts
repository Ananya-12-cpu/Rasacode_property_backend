import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verify organization exists
    const organization = await this.organizationRepository.findOne({
      where: { id: createRoleDto.organization_id },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Check for duplicate role name within the organization
    const existingRole = await this.roleRepository.findOne({
      where: {
        Name: createRoleDto.role,
        organization: { id: createRoleDto.organization_id },
      },
    });

    if (existingRole) {
      throw new ConflictException(
        'Role already exists in this organization',
      );
    }

    // Auto-generate role_title from role name if not provided
    // e.g., "super_admin" -> "Super Admin", "Viewers" -> "Viewers"
    const roleTitle =
      createRoleDto.role_title ||
      createRoleDto.role
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const role = this.roleRepository.create({
      Name: createRoleDto.role,
      role_title: roleTitle,
      organization: organization,
    });

    const savedRole = await this.roleRepository.save(role);

    // Create permissions for the role
    for (const permissionData of createRoleDto.permission) {
      const permission = this.permissionRepository.create({
        role: savedRole,
        permissions: permissionData,
      });
      await this.permissionRepository.save(permission);
    }

    return this.findRoleById(savedRole.Id);
  }

  async findAllRoles(organizationId?: string): Promise<Role[]> {
    const whereClause: any = {};
    if (organizationId) {
      whereClause.organization = { id: organizationId };
    }
    return this.roleRepository.find({
      where: whereClause,
      relations: ['permissions', 'organization'],
    });
  }

  async findRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { Id: id },
      relations: ['permissions', 'organization'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findRoleByName(name: string, organizationId?: string): Promise<Role> {
    const whereClause: any = { Name: name };
    if (organizationId) {
      whereClause.organization = { id: organizationId };
    }
    const role = await this.roleRepository.findOne({
      where: whereClause,
      relations: ['permissions', 'organization'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRoleById(id);

    if (updateRoleDto.role) {
      // Check uniqueness within the same organization
      const existingRole = await this.roleRepository.findOne({
        where: {
          Name: updateRoleDto.role,
          organization: { id: role.organization?.id },
        },
      });

      if (existingRole && existingRole.Id !== id) {
        throw new ConflictException(
          'Role name already exists in this organization',
        );
      }

      role.Name = updateRoleDto.role;
    }

    if (updateRoleDto.role_title) {
      role.role_title = updateRoleDto.role_title;
    }

    if (updateRoleDto.role || updateRoleDto.role_title) {
      await this.roleRepository.save(role);
    }

    if (updateRoleDto.permission) {
      // Delete existing permissions
      await this.permissionRepository.delete({ role: { Id: id } });

      // Fetch the role again to ensure we have the latest state
      const updatedRole = await this.roleRepository.findOne({
        where: { Id: id },
      });

      if (!updatedRole) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }

      // Create new permissions
      for (const permissionData of updateRoleDto.permission) {
        const permission = this.permissionRepository.create({
          role: updatedRole,
          permissions: permissionData,
        });
        await this.permissionRepository.save(permission);
      }
    }

    return this.findRoleById(id);
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.findRoleById(id);
    await this.roleRepository.remove(role);
  }

  async checkPermission(
    userId: number,
    resource: 'campaign' | 'properties',
    action: 'add' | 'view' | 'edit' | 'delete',
  ): Promise<boolean> {
    // Query from User side to get their roles and permissions
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }

    // Check if user has the required permission
    for (const role of user.roles) {
      for (const permission of role.permissions) {
        if (permission.permissions[resource]) {
          if (permission.permissions[resource][action]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  async getUserPermissions(userId: number): Promise<any> {
    // Query from User side to get their roles and permissions
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user || !user.roles) {
      return [];
    }

    return user.roles.map((role) => ({
      role: role.Name,
      role_title: role.role_title,
      permissions: role.permissions.map((p) => p.permissions),
    }));
  }
}
