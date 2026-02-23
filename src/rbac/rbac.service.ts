import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

const SUPER_ADMIN_PERMISSIONS = {
  campaign: { add: true, view: true, edit: true, delete: true },
  properties: { add: true, view: true, edit: true, delete: true },
  user_management: { add: true, view: true, edit: true, delete: true },
  buyer: { add: true, view: true, edit: true, delete: true },
  seller: { add: true, view: true, edit: true, delete: true },
  broker: { add: true, view: true, edit: true, delete: true },
};

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

  async findAllRoles(
    requestingUserRoles: string[],
    requestingUserOrgId: number | null,
    organizationId?: number,
  ) {
    const isSuperAdmin = requestingUserRoles.includes('super_admin');
    const isEnterprise = requestingUserRoles.includes('enterprise_role');

    let roles: Role[];

    if (isSuperAdmin) {
      // super_admin sees all global roles (no organization attached)
      const whereClause: any = organizationId
        ? { organization: { id: organizationId } }
        : {};
      roles = await this.roleRepository.find({
        where: whereClause,
        relations: ['permissions', 'organization'],
      });
    } else if (isEnterprise && requestingUserOrgId) {
      // enterprise_role user sees only buyer, seller, broker of their own organization
      roles = await this.roleRepository.find({
        where: {
          Name: In(['buyer', 'seller', 'broker']),
          organization: { id: requestingUserOrgId },
        },
        relations: ['permissions', 'organization'],
      });
    } else {
      return [];
    }

    // Fetch users from the owning side (User has @JoinTable) — only safe fields
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.username',
        'user.first_name',
        'user.last_name',
        'user.email',
        'role.Id',
      ])
      .getMany();

    // Build roleId -> users[] map
    const roleUserMap = new Map<number, { id: number; username: string; first_name: string; last_name: string; email: string }[]>();
    for (const user of users) {
      for (const role of user.roles ?? []) {
        if (!roleUserMap.has(role.Id)) {
          roleUserMap.set(role.Id, []);
        }
        roleUserMap.get(role.Id)!.push({
          id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        });
      }
    }

    return roles.map((role) => ({
      id: role.Id,
      name: role.Name,
      role_title: role.role_title,
      organization: role.organization
        ? { id: role.organization.id, name: role.organization.name }
        : null,
      permissions: role.permissions ?? [],
      users: roleUserMap.get(role.Id) ?? [],
      user_count: roleUserMap.get(role.Id)?.length ?? 0,
    }));
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

  async findRoleByName(name: string, organizationId?: number): Promise<Role> {
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

    if (role.Name === 'super_admin') {
      throw new ForbiddenException(
        'The super_admin role cannot be modified',
      );
    }

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

    if (role.Name === 'super_admin') {
      throw new ForbiddenException(
        'The super_admin role cannot be deleted',
      );
    }

    await this.roleRepository.remove(role);
  }

  async checkPermission(
    userId: number,
    resource: 'campaign' | 'properties' | 'user_management' | 'buyer' | 'seller' | 'broker',
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

    // Super admin has all permissions
    const isSuperAdmin = user.roles.some((r) => r.Name === 'super_admin');
    if (isSuperAdmin) {
      return true;
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

    return user.roles.map((role) => {
      // Super admin always gets full permissions
      if (role.Name === 'super_admin') {
        return {
          role: role.Name,
          role_title: role.role_title,
          permissions: [SUPER_ADMIN_PERMISSIONS],
        };
      }

      return {
        role: role.Name,
        role_title: role.role_title,
        permissions: role.permissions.map((p) => p.permissions),
      };
    });
  }
}
