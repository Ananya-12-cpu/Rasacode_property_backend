import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

async function seedSuperAdmin() {
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
    console.log('Database connected');

    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    // Check if super_admin role exists
    let superAdminRole = await roleRepository.findOne({
      where: { Name: 'super_admin' },
    });

    if (!superAdminRole) {
      console.log('super_admin role not found. Please run seed-roles first.');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { username: 'superadmin@example.com' },
    });

    if (existingUser) {
      console.log(
        'Super admin user already exists, updating password and role...',
      );
      existingUser.passwordHash = await bcrypt.hash('password123', 10);
      existingUser.roles = [superAdminRole];
      await userRepository.save(existingUser);
      console.log('Super admin user updated');
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
      console.log('Super admin user created');
    }

    console.log('Credentials: superadmin@example.com / password123');

    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedSuperAdmin();
