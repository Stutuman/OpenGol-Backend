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
// Importamos la entidad Field porque necesitamos asegurarnos de que la cancha exista
import { Field } from '../fields/entities/field.entity'; 

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const { fieldId, bookingDate, startTime, endTime, guestName, guestPhone } = createBookingDto;

    try {
      // 1. Verificamos que la cancha exista en el club
      const field = await this.fieldRepository.findOneBy({ id: fieldId });
      if (!field) {
        throw new NotFoundException(`La cancha con ID ${fieldId} no existe.`);
      }

      // 2. EL ESCUDO ANTI-CHOQUES (Double Booking Prevention)
      // Buscamos si ya hay una reserva que ocupe ese mismo espacio de tiempo
      const overlappingBooking = await this.bookingRepository.createQueryBuilder('booking')
        .where('booking.fieldId = :fieldId', { fieldId })
        .andWhere('booking.bookingDate = :bookingDate', { bookingDate })
        // QA Tip: ¡Las reservas CANCELADAS no cuentan! Si alguien canceló, la cancha está libre.
        .andWhere('booking.status != :cancelledStatus', { cancelledStatus: BookingStatus.CANCELLED })
        // Usamos Brackets para agrupar la lógica de choque de horarios con paréntesis en el SQL
        .andWhere(new Brackets(qb => {
          qb.where('booking.startTime < :endTime AND booking.endTime > :startTime', { 
            startTime, 
            endTime 
          });
        }))
        .getOne();

      if (overlappingBooking) {
        // Lanzamos un error 409 Conflict, que es el código HTTP exacto para "Choque de recursos"
        throw new ConflictException('¡Uf! La cancha ya se encuentra reservada en ese horario.');
      }

      // 3. Definimos a nombre de quién queda la reserva
      // Si mandaron nombre de invitado, el playerId queda nulo. Si no, es el usuario de la app.
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
  
}
