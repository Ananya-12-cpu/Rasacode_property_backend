import { DataSource } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);

  console.log('🌱 Seeding roles...');

  // Check if roles already exist
  const existingRoles = await roleRepository.find();
  if (existingRoles.length > 0) {
    console.log('⚠️  Roles already exist, skipping seed...');
    return;
  }

  // Create super_admin role
  const superAdminRole = roleRepository.create({
    Name: 'super_admin',
    role_title: 'Super Admin',
  });
  await roleRepository.save(superAdminRole);

  const superAdminPermission = permissionRepository.create({
    role: superAdminRole,
    permissions: {
      campaign: {
        add: true,
        view: true,
        edit: true,
        delete: true,
      },
      properties: {
        add: true,
        view: true,
        edit: true,
        delete: true,
      },
    },
  });
  await permissionRepository.save(superAdminPermission);

  console.log('✅ Created super_admin role with full permissions');

  // Create user role
  const userRole = roleRepository.create({
    Name: 'user',
    role_title: 'User',
  });
  await roleRepository.save(userRole);

  const userPermission = permissionRepository.create({
    role: userRole,
    permissions: {
      campaign: {
        add: false,
        view: true,
        edit: true,
        delete: true,
      },
      properties: {
        add: true,
        view: true,
        edit: false,
        delete: false,
      },
    },
  });
  await permissionRepository.save(userPermission);

  console.log('✅ Created user role with limited permissions');

  console.log('🎉 Role seeding completed!');
}
