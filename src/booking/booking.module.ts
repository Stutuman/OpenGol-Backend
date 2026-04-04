import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Field } from 'src/fields/entities/field.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Booking,Field])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
