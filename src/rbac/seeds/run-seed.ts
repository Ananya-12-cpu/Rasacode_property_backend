import 'dotenv/config';
import { DataSource } from 'typeorm';
import { seedRoles } from './seed-roles';
import { seedSuperAdmin } from './seed-superadmin';

async function runSeed() {
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

    await seedRoles(dataSource);
    await seedSuperAdmin(dataSource);

    await dataSource.destroy();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
