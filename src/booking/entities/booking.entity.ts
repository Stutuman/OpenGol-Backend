import { 
  Entity, PrimaryGeneratedColumn, Column, 
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn 
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL', // Ideal para cuando pagan solo la seña
  PAID = 'PAID',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  fieldId: number; // ID de la cancha

  // --- MUNDO 1: USUARIO CON CUENTA ---
  @Column({ type: 'int', nullable: true })
  playerId: number; 

  // --- MUNDO 2: USUARIO DE MOSTRADOR / TELÉFONO ---
  @Column({ type: 'varchar', nullable: true })
  guestName: string;

  @Column({ type: 'varchar', nullable: true })
  guestPhone: string;

  // --- EL TIEMPO ---
  @Column({ type: 'date' })
  bookingDate: Date; // Usamos date puro para búsquedas rápidas

  @Column({ type: 'time' })
  startTime: string; // ej: '20:00:00'

  @Column({ type: 'time' })
  endTime: string; // ej: '21:00:00'

  // --- EL DINERO Y ESTADOS ---
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number; 

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  // --- LAS IDEAS DE TU GRÁFICO ---
  @Column({ type: 'varchar', nullable: true })
  cancellationReason: string; // "Llovió", "No llegaron a ser 10", etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date; 
}

