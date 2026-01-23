import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './jwt.constants';
import { UsersModule } from '../users/users.module';
import { UserSubscription } from '../entities/user-subscription.entity';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.accessSecret,
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule,
    TypeOrmModule.forFeature([UserSubscription]),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
