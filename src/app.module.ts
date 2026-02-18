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
import { CampaignModule } from './campaign/campaign.module';
import { RbacModule } from './rbac/rbac.module';
import { PlanModule } from './plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ContactsModule } from './contacts/contacts.module';
import { OrganizationModule } from './organization/organization.module';
import { RentalModule } from './rental/rental.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mssql',
          host: configService.get<string>('DB_HOST'),
          port: parseInt(configService.get<string>('DB_PORT') as string),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
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
    CampaignModule,
    RbacModule,
    PlanModule,
    SubscriptionModule,
    ContactsModule,
    OrganizationModule,
    RentalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
