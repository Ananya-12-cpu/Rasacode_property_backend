/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataSource } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
// This instance loads .env files from the root by default
// const configService = new ConfigService();
console.log('Database Configurations:');
console.log('DB_HOST:', process.env['DB_HOST']);
console.log('DB_PORT:', process.env['DB_PORT']);
console.log('DB_USER:', process.env['DB_USER']);
console.log('DB_NAME:', process.env['DB_NAME']);
export default new DataSource({
  type: 'mssql',
  schema: 'dbo',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] as string) || 1433,
  username: process.env['DB_USER'] || 'ananyalogin',
  password: process.env['DB_PASSWORD'] || '123',
  database: process.env['DB_NAME'] || 'EliteDB',
  //   autoLoadEntities: true,
  options: {
    trustServerCertificate: true,
  },
  synchronize: false,
  // Migration settings: when running via ts-node use the TS files in src,
  // after build use the JS files in dist. Use a single pattern for ts-node
  // to avoid loading duplicate .js/.ts variants which causes duplicate
  // migration errors.
  migrations: [
    // 'dist/migrations/*{.js,.ts}',
    'src/migrations/*{.js,.ts}',
  ],
  entities: [
    // 'dist/**/*.entity{.ts,.js}',
    'src/entities/*.entity{.ts,.js}',
  ],
  // optional
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
});
