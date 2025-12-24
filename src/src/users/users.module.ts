// import { Module } from '@nestjs/common';
// import { UsersController } from './users.controller';

// @Module({
//   controllers: [UsersController],
// })
// export class UsersModule {}

// users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
