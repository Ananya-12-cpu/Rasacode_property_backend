import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './../entities/property.entity';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [TypeOrmModule.forFeature([Property]), RbacModule],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [TypeOrmModule],
})
export class PropertyModule {}
