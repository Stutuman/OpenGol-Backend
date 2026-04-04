import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    getStats(): Promise<{
        date: string;
        reservasHoy: number;
        ingresosMes: number;
    }>;
    create(createBookingDto: CreateBookingDto, req: any): Promise<{
        message: string;
        booking: import("./entities/booking.entity").Booking;
    }>;
    findAll(filters: GetBookingsFilterDto): Promise<import("./entities/booking.entity").Booking[]>;
    cancel(id: number, cancelBookingDto: CancelBookingDto, req: any): Promise<{
        message: string;
        booking: import("./entities/booking.entity").Booking;
    }>;
    updatePayment(id: number, updatePaymentDto: UpdatePaymentDto): Promise<{
        message: string;
        booking: import("./entities/booking.entity").Booking;
    }>;
}
