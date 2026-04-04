import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Field } from '../fields/entities/field.entity';
import { CancelBookingDto } from './dto/cancel-booking.dto';
export declare class BookingService {
    private bookingRepository;
    private fieldRepository;
    constructor(bookingRepository: Repository<Booking>, fieldRepository: Repository<Field>);
    create(createBookingDto: CreateBookingDto, userId: number): Promise<{
        message: string;
        booking: Booking;
    }>;
    cancel(id: number, userId: number, cancelBookingDto: CancelBookingDto): Promise<{
        message: string;
        booking: Booking;
    }>;
}
