import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'ananyalogin',
      password: '123',
      database: 'EliteDB',
      autoLoadEntities: true,
      options: {
        trustServerCertificate: true,
      },
      // synchronize: true,
      // Migration settings: when running via ts-node use TS migrations in src.
      // After build switch this to dist/migrations/*.js to avoid duplicates.
      migrations: ['src/migrations/*{.ts}'],
      // optional
      migrationsRun: false,
      migrationsTableName: 'migrations',
      migrationsTransactionMode: 'all',
    }),
    AuthModule,
    LoginModule,
    RegisterModule,
    UsersModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
