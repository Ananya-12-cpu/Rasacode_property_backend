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
  // Migration settings (place your migration files in src/migrations during
  // development and dist/migrations after build):
  migrations: ['dist/migrations/*{.js,.ts}', 'src/migrations/*{.js,.ts}'],
  entities: [
    // 'dist/**/*.entity{.ts,.js}',
    'src/entities/*.entity{.ts,.js}',
  ],
  // optional
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
});
