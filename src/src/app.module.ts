import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
      // Migration settings (place your migration files in src/migrations during
      // development and dist/migrations after build):
      migrations: ['dist/migrations/*{.js,.ts}', 'src/migrations/*{.js,.ts}'],
      // optional
      migrationsRun: false,
      migrationsTableName: 'migrations',
      migrationsTransactionMode: 'all',
    }),
    AuthModule,
    LoginModule,
    RegisterModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
