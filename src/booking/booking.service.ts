import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException, 
  BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Booking, BookingStatus, PaymentStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Field } from '../fields/entities/field.entity'; 
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { GetBookingsFilterDto } from './dto/get-bookings-filter.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const { fieldId, bookingDate, startTime, endTime, guestName, guestPhone } = createBookingDto;

    try {
      const field = await this.fieldRepository.findOneBy({ id: fieldId });
      if (!field) {
        throw new NotFoundException(`La cancha con ID ${fieldId} no existe.`);
      }
      
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      const startInHours = startHour + (startMinute / 60);
      const endInHours = endHour + (endMinute / 60);
      const durationInHours = endInHours - startInHours;
      if (durationInHours <= 0) {
        throw new BadRequestException('La hora de finalización debe ser posterior a la de inicio.');
      }
      const calculatedTotalPrice = durationInHours * field.pricePerHour;
      const overlappingBooking = await this.bookingRepository.createQueryBuilder('booking')
        .where('booking.fieldId = :fieldId', { fieldId })
        .andWhere('booking.bookingDate = :bookingDate', { bookingDate })
        .andWhere('booking.status != :cancelledStatus', { cancelledStatus: BookingStatus.CANCELLED })
        .andWhere(new Brackets(qb => {
          qb.where('booking.startTime < :endTime AND booking.endTime > :startTime', { 
            startTime, 
            endTime 
          });
        }))
        .getOne();

      if (overlappingBooking) {
        throw new ConflictException('¡Uf! La cancha ya se encuentra reservada en ese horario.');
      }
      
      const finalPlayerId = guestName ? null : userId;
      // 4. Armamos la reserva final
      const newBooking = this.bookingRepository.create({
        ...createBookingDto,
        playerId: finalPlayerId,
        // Por ahora lo hardcodeamos en 0, en el futuro lo calculamos multiplicando las horas por el precio de la cancha
        totalPrice: calculatedTotalPrice, 
      });

      await this.bookingRepository.save(newBooking);

      return {
        message: '¡Reserva confirmada con éxito!',
        booking: newBooking
      };

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Ocurrió un error al procesar la reserva.');
    }
  }
  async updatePaymentStatus(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const booking = await this.bookingRepository.findOneBy({ id });

      if (!booking) {
        throw new NotFoundException(`La reserva con ID ${id} no existe.`);
      }

      // Actualizamos el estado del pago
      booking.paymentStatus = updatePaymentDto.paymentStatus;

      await this.bookingRepository.save(booking);

      return {
        message: '¡Estado de pago actualizado correctamente!',
        booking
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el pago.');
    }
  }
  async findAllWithFilters(filters:GetBookingsFilterDto){
    const{clubId,startDate,endDate,includeCancelled}=filters;
    let fieldIds:number[]=[];
    if(clubId){
      const fields = await this.fieldRepository.find({where: {clubId:parseInt(clubId)}})
      if(fieldIds.length===0) return[];
    }
    const query = this.bookingRepository.createQueryBuilder('booking');
    // Filtramos por las canchas del club (si mandaron clubId)
    if (fieldIds.length > 0) {
      query.andWhere('booking.fieldId IN (:...fieldIds)', { fieldIds });
    }

    // Filtramos por el rango de fechas de la semana o del día
    if (startDate) {
      query.andWhere('booking.bookingDate >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('booking.bookingDate <= :endDate', { endDate });
    }

    // El botoncito del Frontend: "Mostrar canceladas"
    if (includeCancelled !== 'true') {
      query.andWhere('booking.status != :cancelledStatus', { 
        cancelledStatus: BookingStatus.CANCELLED 
      });
    }

    // Ordenamos por fecha y hora para que el Frontend lo dibuje más fácil
    query.orderBy('booking.bookingDate', 'ASC')
         .addOrderBy('booking.startTime', 'ASC');

    const bookings = await query.getMany();
    return bookings;
  }

  async cancel(id:number,userId: number, cancelBookingDto:CancelBookingDto){
    try {
      const booking = await this.bookingRepository.findOneBy({id});
      if(!booking){
        throw new NotFoundException(`la reserva con ID ${id} no existe`);
      }
      if(booking.status === BookingStatus.CANCELLED){
        throw new ConflictException('La reserva se encuentra cancelada');
      }
       //agregar validacion para que solo el dueno o el jugador puedan cancelar
       booking.status=BookingStatus.CANCELLED;
       booking.cancellationReason=cancelBookingDto.cancellationReason;
       await this.bookingRepository.save(booking);
       return{
        message:'Reserva cancelada exitosamente',
        booking
       };
      
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException('Error al intentar cancelar la reserva.');
    }
    }
    async getDashboardStats() {
    
    const today = new Date();

    const todayString = today.toISOString().split('T')[0]; 

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayString = firstDayOfMonth.toISOString().split('T')[0];
    
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastDayString = lastDayOfMonth.toISOString().split('T')[0];

    // --- CÁLCULO 1: RESERVAS DE HOY ---
    const todayBookingsCount = await this.bookingRepository.createQueryBuilder('booking')
      .where('booking.bookingDate = :todayString', { todayString })
      // QA Tip: Ignoramos las canceladas porque no son turnos reales
      .andWhere('booking.status != :cancelledStatus', { cancelledStatus: BookingStatus.CANCELLED })
      .getCount(); // getCount() es súper rápido, no trae todos los datos, solo el número.

    // --- CÁLCULO 2: INGRESOS DEL MES ---
    
    const monthlyIncomeResult = await this.bookingRepository.createQueryBuilder('booking')
      .select('SUM(booking.totalPrice)', 'total') // Función matemática pura de SQL
      .where('booking.bookingDate >= :firstDay', { firstDay: firstDayString })
      .andWhere('booking.bookingDate <= :lastDay', { lastDay: lastDayString })
      .andWhere('booking.status != :cancelledStatus', { cancelledStatus: BookingStatus.CANCELLED })
      .andWhere('booking.paymentStatus = :paidStatus', { paidStatus: PaymentStatus.PAID })
      .getRawOne();

    // Si no hay reservas pagadas, SUM devuelve null, así que lo atajamos con un 0
    const monthlyIncome = monthlyIncomeResult.total ? parseFloat(monthlyIncomeResult.total) : 0;

    return {
      date: todayString,
      reservasHoy: todayBookingsCount,
      ingresosMes: monthlyIncome,
      
    };
  }
  }


