import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(createBookingDto: CreateBookingDto, req: any): Promise<{
        message: string;
        booking: import("./entities/booking.entity").Booking;
    }>;
    cancel(id: number, cancelBookingDto: CancelBookingDto, req: any): Promise<{
        message: string;
        booking: import("./entities/booking.entity").Booking;
    }>;
}
