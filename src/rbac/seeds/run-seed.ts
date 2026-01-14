import 'dotenv/config';
import { DataSource } from 'typeorm';
import { seedRoles } from './seed-roles';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string) || 1433,
    username: process.env.DB_USER || 'ananyalogin',
    password: process.env.DB_PASSWORD || '123',
    database: process.env.DB_NAME || 'EliteDB',
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

    await dataSource.destroy();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
