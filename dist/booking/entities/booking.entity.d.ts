export declare enum PaymentStatus {
    PENDING = "PENDING",
    PARTIAL = "PARTIAL",
    PAID = "PAID"
}
export declare enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare class Booking {
    id: number;
    fieldId: number;
    playerId: number | null;
    guestName: string | null;
    guestPhone: string | null;
    bookingDate: Date;
    startTime: string;
    endTime: string;
    totalPrice: number;
    paymentStatus: PaymentStatus;
    status: BookingStatus;
    cancellationReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
