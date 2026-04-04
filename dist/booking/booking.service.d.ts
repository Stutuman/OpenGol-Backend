import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Field } from '../fields/entities/field.entity';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class BookingService {
    private bookingRepository;
    private fieldRepository;
    constructor(bookingRepository: Repository<Booking>, fieldRepository: Repository<Field>);
    create(createBookingDto: CreateBookingDto, userId: number): Promise<{
        message: string;
        booking: Booking;
    }>;
    updatePaymentStatus(id: number, updatePaymentDto: UpdatePaymentDto): Promise<{
        message: string;
        booking: Booking;
    }>;
    findAllWithFilters(filters: GetBookingsFilterDto): Promise<Booking[]>;
    cancel(id: number, userId: number, cancelBookingDto: CancelBookingDto): Promise<{
        message: string;
        booking: Booking;
    }>;
    getDashboardStats(): Promise<{
        date: string;
        reservasHoy: number;
        ingresosMes: number;
    }>;
}
