import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

// 1. Definimos los estados posibles del club (Máquina de Estados)
export enum ClubStatus {
  PENDING = 'PENDING',   // Recién creado por el usuario, esperando tu auditoría
  APPROVED = 'APPROVED', // Validado por vos, visible para recibir reservas
  REJECTED = 'REJECTED', // Estafa detectada o club baneado por mal comportamiento
}

@Entity('clubs')
export class Club {
  
  @PrimaryGeneratedColumn()
  id: number;

  // --- DATOS PÚBLICOS DEL CLUB ---

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  // Horarios de atención (ej: '08:00' y '23:00')
  @Column({ type: 'varchar', length: 5 })
  openingTime: string;

  @Column({ type: 'varchar', length: 5 })
  closingTime: string;

  // --- LÓGICA DE NEGOCIO Y SEGURIDAD (Lo que no ve el jugador normal) ---

  // El estado arranca en PENDING obligatoriamente para que no te estafen
  @Column({ type: 'enum', enum: ClubStatus, default: ClubStatus.PENDING })
  status: ClubStatus;

  // El ID del usuario que registró el club (el que va a ser OWNER)
  @Column({ type: 'int' })
  ownerId: number;

  // Escudo Legal: Fecha y hora exacta en la que aceptó que openGol manda sobre las reservas
  @Column({ type: 'timestamp' })
  termsAcceptedAt: Date;

  // Sistema de Reputación: Contador de veces que dejó a gente afuera (empieza en 0)
  @Column({ type: 'int', default: 0 })
  strikes: number;

  @Column({ type: 'uuid', nullable: true })
  logoAttachmentId?: string | null;

  // --- AUDITORÍA Y SOFT DELETE ---

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' }) // Para no perder el historial financiero
  deletedAt: Date;
}