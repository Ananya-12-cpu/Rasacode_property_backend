import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './jwt.constants';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.accessSecret,
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
