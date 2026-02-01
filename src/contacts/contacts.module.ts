import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RbacModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
