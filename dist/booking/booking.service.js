"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const field_entity_1 = require("../fields/entities/field.entity");
let BookingService = class BookingService {
    bookingRepository;
    fieldRepository;
    constructor(bookingRepository, fieldRepository) {
        this.bookingRepository = bookingRepository;
        this.fieldRepository = fieldRepository;
    }
    async create(createBookingDto, userId) {
        const { fieldId, bookingDate, startTime, endTime, guestName, guestPhone } = createBookingDto;
        try {
            const field = await this.fieldRepository.findOneBy({ id: fieldId });
            if (!field) {
                throw new common_1.NotFoundException(`La cancha con ID ${fieldId} no existe.`);
            }
            const [startHour, startMinute] = startTime.split(':').map(Number);
            const [endHour, endMinute] = endTime.split(':').map(Number);
            const startInHours = startHour + (startMinute / 60);
            const endInHours = endHour + (endMinute / 60);
            const durationInHours = endInHours - startInHours;
            if (durationInHours <= 0) {
                throw new common_1.BadRequestException('La hora de finalización debe ser posterior a la de inicio.');
            }
            const calculatedTotalPrice = durationInHours * field.pricePerHour;
            const overlappingBooking = await this.bookingRepository.createQueryBuilder('booking')
                .where('booking.fieldId = :fieldId', { fieldId })
                .andWhere('booking.bookingDate = :bookingDate', { bookingDate })
                .andWhere('booking.status != :cancelledStatus', { cancelledStatus: booking_entity_1.BookingStatus.CANCELLED })
                .andWhere(new typeorm_2.Brackets(qb => {
                qb.where('booking.startTime < :endTime AND booking.endTime > :startTime', {
                    startTime,
                    endTime
                });
            }))
                .getOne();
            if (overlappingBooking) {
                throw new common_1.ConflictException('¡Uf! La cancha ya se encuentra reservada en ese horario.');
            }
            const finalPlayerId = guestName ? null : userId;
            const newBooking = this.bookingRepository.create({
                ...createBookingDto,
                playerId: finalPlayerId,
                totalPrice: calculatedTotalPrice,
            });
            await this.bookingRepository.save(newBooking);
            return {
                message: '¡Reserva confirmada con éxito!',
                booking: newBooking
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('Ocurrió un error al procesar la reserva.');
        }
    }
    async updatePaymentStatus(id, updatePaymentDto) {
        try {
            const booking = await this.bookingRepository.findOneBy({ id });
            if (!booking) {
                throw new common_1.NotFoundException(`La reserva con ID ${id} no existe.`);
            }
            booking.paymentStatus = updatePaymentDto.paymentStatus;
            await this.bookingRepository.save(booking);
            return {
                message: '¡Estado de pago actualizado correctamente!',
                booking
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('Error al actualizar el pago.');
        }
    }
    async findAllWithFilters(filters) {
        const { clubId, startDate, endDate, includeCancelled } = filters;
        let fieldIds = [];
        if (clubId) {
            const fields = await this.fieldRepository.find({ where: { clubId: parseInt(clubId) } });
            if (fieldIds.length === 0)
                return [];
        }
        const query = this.bookingRepository.createQueryBuilder('booking');
        if (fieldIds.length > 0) {
            query.andWhere('booking.fieldId IN (:...fieldIds)', { fieldIds });
        }
        if (startDate) {
            query.andWhere('booking.bookingDate >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('booking.bookingDate <= :endDate', { endDate });
        }
        if (includeCancelled !== 'true') {
            query.andWhere('booking.status != :cancelledStatus', {
                cancelledStatus: booking_entity_1.BookingStatus.CANCELLED
            });
        }
        query.orderBy('booking.bookingDate', 'ASC')
            .addOrderBy('booking.startTime', 'ASC');
        const bookings = await query.getMany();
        return bookings;
    }
    async cancel(id, userId, cancelBookingDto) {
        try {
            const booking = await this.bookingRepository.findOneBy({ id });
            if (!booking) {
                throw new common_1.NotFoundException(`la reserva con ID ${id} no existe`);
            }
            if (booking.status === booking_entity_1.BookingStatus.CANCELLED) {
                throw new common_1.ConflictException('La reserva se encuentra cancelada');
            }
            booking.status = booking_entity_1.BookingStatus.CANCELLED;
            booking.cancellationReason = cancelBookingDto.cancellationReason;
            await this.bookingRepository.save(booking);
            return {
                message: 'Reserva cancelada exitosamente',
                booking
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('Error al intentar cancelar la reserva.');
        }
    }
    async getDashboardStats() {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayString = firstDayOfMonth.toISOString().split('T')[0];
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const lastDayString = lastDayOfMonth.toISOString().split('T')[0];
        const todayBookingsCount = await this.bookingRepository.createQueryBuilder('booking')
            .where('booking.bookingDate = :todayString', { todayString })
            .andWhere('booking.status != :cancelledStatus', { cancelledStatus: booking_entity_1.BookingStatus.CANCELLED })
            .getCount();
        const monthlyIncomeResult = await this.bookingRepository.createQueryBuilder('booking')
            .select('SUM(booking.totalPrice)', 'total')
            .where('booking.bookingDate >= :firstDay', { firstDay: firstDayString })
            .andWhere('booking.bookingDate <= :lastDay', { lastDay: lastDayString })
            .andWhere('booking.status != :cancelledStatus', { cancelledStatus: booking_entity_1.BookingStatus.CANCELLED })
            .andWhere('booking.paymentStatus = :paidStatus', { paidStatus: booking_entity_1.PaymentStatus.PAID })
            .getRawOne();
        const monthlyIncome = monthlyIncomeResult.total ? parseFloat(monthlyIncomeResult.total) : 0;
        return {
            date: todayString,
            reservasHoy: todayBookingsCount,
            ingresosMes: monthlyIncome,
        };
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(field_entity_1.Field)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookingService);
//# sourceMappingURL=booking.service.js.map