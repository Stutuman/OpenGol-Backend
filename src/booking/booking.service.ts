import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Field } from '../fields/entities/field.entity'; 
import { CancelBookingDto } from './dto/cancel-booking.dto';

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
        totalPrice: 0, 
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
  }


