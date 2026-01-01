/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LeadModule } from './lead/lead.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mssql',
          host: configService.get<string>('DB_HOST') || 'localhost',
          port:
            parseInt(configService.get<string>('DB_PORT') as string) || 1433,
          username: configService.get<string>('DB_USER') || 'ananyalogin',
          password: configService.get<string>('DB_PASSWORD') || '123',
          database: configService.get<string>('DB_NAME') || 'EliteDB',
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
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    LoginModule,
    RegisterModule,
    UsersModule,
    PropertyModule,
    LeadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
