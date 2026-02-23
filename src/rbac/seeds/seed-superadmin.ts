import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

export async function seedSuperAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  console.log('🌱 Seeding superadmin user...');

  // Check if super_admin role exists
  const superAdminRole = await roleRepository.findOne({
    where: { Name: 'super_admin' },
  });

  if (!superAdminRole) {
    console.log(
      '❌ super_admin role not found. Please run seed:roles first.',
    );
    return;
  }

  // Check if user already exists
  const existingUser = await userRepository.findOne({
    where: { username: 'superadmin@example.com' },
  });

  if (existingUser) {
    console.log(
      '⚠️  Super admin user already exists, updating password and role...',
    );
    existingUser.passwordHash = await bcrypt.hash('password123', 10);
    existingUser.roles = [superAdminRole];
    existingUser.organization = null as any;
    await userRepository.save(existingUser);
    console.log('✅ Super admin user updated');
  } else {
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = userRepository.create({
      username: 'superadmin@example.com',
      passwordHash,
      first_name: 'Super',
      last_name: 'Admin',
      roles: [superAdminRole],
    } as any);
    await userRepository.save(user);
    console.log('✅ Super admin user created');
  }

  console.log('🔑 Credentials: superadmin@example.com / password123');
}

// Standalone runner — only executes when this file is run directly
async function run() {
  const dataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
    options: {
      trustServerCertificate: true,
    },
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    await seedSuperAdmin(dataSource);

    await dataSource.destroy();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Only run when executed directly (e.g. npm run seed:superadmin), not when imported
if (require.main === module) {
  run();
}
