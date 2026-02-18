import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyRental } from '../entities/property-rental.entity';
import { User } from '../entities/user.entity';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyRental, User]), RbacModule],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
