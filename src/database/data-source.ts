import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'ananyalogin',
  password: '123',
  database: 'EliteDB',
  //   autoLoadEntities: true,
  options: {
    trustServerCertificate: true,
  },
  synchronize: false,
  // Migration settings: when running via ts-node use the TS files in src,
  // after build use the JS files in dist. Use a single pattern for ts-node
  // to avoid loading duplicate .js/.ts variants which causes duplicate
  // migration errors.
  migrations: ['src/migrations/*{.ts}'],
  entities: [
    // 'dist/**/*.entity{.ts,.js}',
    'src/entities/*.entity{.ts,.js}',
  ],
  // optional
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
});
