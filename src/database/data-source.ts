/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

// This instance loads .env files from the root by default
const configService = new ConfigService();

export default new DataSource({
  type: 'mssql',
  schema: 'dbo',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: configService.get<number>('DB_PORT') || 1433,
  username: configService.get<string>('DB_USER') || 'ananyalogin',
  password: configService.get<string>('DB_PASSWORD') || '123',
  database: configService.get<string>('DB_NAME') || 'EliteDB',
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
