import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('fields')
export class Field {
  
  // * ID (autogenerado)
  @PrimaryGeneratedColumn()
  id: number;

  // * Nombre o descripción descriptiva (ej: "Cancha 1 - Techada")
  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // * Estado de cancha (activa/inactiva)
  @Column({ default: true })
  isActive: boolean;

  // * Formato cancha (futbol 5/7/11)
  @Column({ type: 'int' })
  format: number;

  // * Fotos de cancha (blob storage) -> Guardamos un array de URLs
  @Column('text', { array: true, default: [] })
  photos: string[];

  @Column('text', { array: true, default: [] })
  imageAttachmentIds: string[];

  // * Pricing (Precio fijo por hora)
  @Column('decimal', { precision: 10, scale: 2 })
  pricePerHour: number;

  // * Reglas de cancelación: Cancelación gratis hasta X horas
  @Column({ type: 'int', default: 0 })
  freeCancellationHours: number;

  // * Precio de seña
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  depositPrice: number;

  // * ID club -> (Por ahora lo dejamos como un número simple, luego haremos la relación)
  @Column({ type: 'int'})
  clubId: number;

  // * Creado en fecha y fecha de última actualización
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // * Eliminar canchas (soft delete) para no perder el historial de reservas
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
